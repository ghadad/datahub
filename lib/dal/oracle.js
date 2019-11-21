process.env['NLS_DATE_FORMAT'] = 'YYYYMMDDHH24MISS';
process.env['NLS_LANG'] = '.AL32UTF8';

var oracledb = require("oracledb");
var SimpleOracleDB = require("simple-oracledb");
var Promise = require("bluebird");
SimpleOracleDB.extend(oracledb);
oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.DATE];


oracledb._enableStats = true;
const klawSync = require("klaw-sync");
const fs = require("fs");
const yaml = require("js-yaml");
var path = require("path");
const CONNECTION_TIMEOUT = 30 * 1000;

const defaultPoolConf =  {
            poolMin: 4,
            poolMax: 4,
            poolIncrement: 0
        } ;



// improve performance by create the key using simple string and not the slwer crypto md5 hasing 
const hash = function (o) {
    return o.sqlStm + "|" + Object.values(o.params).join("|");
}
//__app.hash;

var internal = {
    defaultPool: "",
    sqls: {},
    pools: {},
    realPools : {},
    poolsInfo: {},
    totalConnections:0,
    totalDbConnections : {},
    numbers: {
        dalkey: {
            BAN: true,
            CYCLE_CODE: true
        }
    }
};

const AppError = __app.error;

const logger = __app.logger || require("winston");

function addSuccessEntity(dbres) {
    if (dbres.rowsAffected && dbres.rowsAffected > 0)
        return {
            ...dbres,
            success: true
        };
    return {
        ...dbres,
        success: false
    };
}





function poolsStat() {

}

function removeSns(sql) {
    var snsExp = new RegExp("_SNS([^w])", "gi");
    var replacement = "$1";
    return sql.replace(snsExp, replacement);
}

function replaceCasting(sql) {
    var castRegExp = new RegExp("cast_soc\\W*?\\(\\W*?(\\&*?\\w+)\\W*?\\)", "gi");
   var replacement = `cast (` + "$1" + ` as char(9))`;
    sql = sql.replace(castRegExp, replacement);

    var castRegExp = new RegExp("cast_feature\\W*?\\(\\W*?(\\&*?\\w+)\\W*?\\)", "gi");
    var replacement = `cast (` + "$1" + ` as char(6))`;
    sql = sql.replace(castRegExp, replacement);

    var castRegExp = new RegExp("cast_ctn\\W*?\\(\\W*?(\\&*?\\w+)\\W*?\\)", "gi");
    var replacement = `cast (` + "$1" + ` as char(11))`;
    sql = sql.replace(castRegExp, replacement);

    var castRegExp = new RegExp(`compare\(([^,]+),([^\)]+\))`, "gi");
    var replacement = `( $2  is null or $1 = $2 )`;
    return sql.replace(/compare\(([^,]+),([^\)]+)\)/gi, compareReplacer('$1', '$2'));
}

function replaceMacros(sqlObject) {
    let macrosObject = Object.assign(sqlObject.macros, __app.config.macros);
    var macros = Object.keys(sqlObject.macros);
    if (!macros.length) return sqlObject.sql;
    macros.forEach(c => {
        var constExp = new RegExp(c, "g");
        var replacement = sqlObject.macros[c];
        if (typeof sqlObject.macros[c] === "string" && replacement.match(/^\w/)) {
            replacement = "'" + sqlObject.macros[c] + "'";
        }
        sqlObject.sql = sqlObject.sql.replace(constExp, replacement);
        return;
    });
    return sqlObject.sql;
}



let compareReplacer = function (v1, v2) {
    return "(" + v2 + " is NULL  OR " + v1 + " =  " + v2 + " ) ";
}


function createSqlObject(entry) {
    let sqlObject = {
        dynamic: false
    };
    let sqlkey;
    let sql;

    if (typeof entry === "string") {
        sqlObject.sqlkey = "sqlstm";
        sqlObject.sql = entry;
        sqlObject.author = "Move to YAML please";
        sqlObject.description = "Move to YAML please";
        sqlObject.date = "Move to YAML";
        sqlObject.sql = sqlObject.sql.replace(/\{{(\w+)}}/g, x => x.toUpperCase())
        sqlObject.sql = sqlObject.sql.replace(/\&(\w+)/g, x => x.toUpperCase())

        sqlObject.dynamicParams = sqlObject.sql.match(/\{{(\w+)}}/g) || [];
        if (sqlObject.dynamicParams.length) {
            sqlObject.dynamic = true;
        }
        sqlObject.inSqlParams = entry.match(/\&(\w+)/g) || [];
        return sqlObject;
    }

    let doc = fs.readFileSync(entry.path, "utf8");
    entry.name = path.basename(entry.path);

    if (entry.name.match(/sql$/)) {
        sqlObject.allowCache = true;
        sqlObject.ttl = 0;
        sqlObject.sqlkey = entry.name.replace(".sql", "");
        sqlObject.sql = doc || "";
        sqlObject.author = "Move to YAML";
        sqlObject.description = sqlkey;
        sqlObject.date = "Move to YAML";
        sqlObject.sql.replace(/\{{(\w+)}}/g, "$1".toUpperCase())
        sqlObject.sql.replace(/\&(\w+)/g, "$1".toUpperCase())
        sqlObject.sql = sqlObject.sql.replace(/\{{(\w+)}}/g, x => x.toUpperCase())
        sqlObject.sql = sqlObject.sql.replace(/\&(\w+)/g, x => x.toUpperCase())

        sqlObject.inSqlParams = sqlObject.sql.match(/\&(\w+)/g) || [];
        sqlObject.dynamicParams = sqlObject.sql.match(/\{{(\w+)}}/g) || [];
        if (sqlObject.dynamicParams.length) {
            sqlObject.dynamic = true;
        }
    } else if (entry.name.match(/yaml$/)) {
        sqlObject.sqlkey = entry.name.replace(".yaml", "");
        doc = doc.replace(/\t/g, "   ");
        let yamlDoc;
        try {
            yamlDoc = yaml.safeLoad(doc);
            sqlObject.allowCache = true;
            sqlObject.sql = yamlDoc.sql || "";
            sqlObject.author = yamlDoc.author || "";
            sqlObject.cacheDomain = yamlDoc.cacheDomain || sqlObject.sqlkey;
            sqlObject.errorClass = yamlDoc.errorClass || "";
            sqlObject.macros = yamlDoc.macros || {};
            sqlObject.ttl = yamlDoc.ttl || 0;
            sqlObject.description = yamlDoc.description || "";
            sqlObject.date = yamlDoc.date || "";
            sqlObject.params = yamlDoc.params || [];
            sqlObject.sql = sqlObject.sql.replace(/\{{(\w+)}}/g, x => x.toUpperCase())
            sqlObject.sql = sqlObject.sql.replace(/\&(\w+)/g, x => x.toUpperCase())
            sqlObject.inSqlParams = sqlObject.sql.match(/\&(\w+)/g) || [];
            sqlObject.sql = replaceMacros(sqlObject);
            sqlObject.sql = replaceCasting(sqlObject.sql);
            if (!__app.config.oracle.useSnapshots)
                sqlObject.sql = removeSns(sqlObject.sql);

            sqlObject.dynamicParams = sqlObject.sql.match(/\{{(\w+)}}/g) || [];
            if (sqlObject.dynamicParams.length) {
                sqlObject.dynamic = true;
            }
        } catch (e) {
            throw new AppError(
                "Cant read yaml/sql file . please fix " + sqlObject.sqlkey, {
                    fatal: true,
                    code: "DAL_01",
                    level: "APP"
                }
            );
        }
    }

    if (!(sqlObject.sql && sqlObject.sqlkey)) {
        throw new AppError(
            "Cant read yaml/sql file . please fix " + sqlObject.sqlkey, {
                fatal: true,
                code: "DAL_02",
                level: "APP"
            }
        );
    }
    return sqlObject;
}

var sanitize = function (sqlParams, sentParams, options) {
    let returnParams = {};
    sqlParams.forEach(p => {
        p = p.replace("&", "");
        if (p in sentParams) {
            returnParams[p] = sentParams[p];
        } else {
            if (internal.conf.explicitNullValue && options.fillNull != true)
                throw new AppError("Missing parameter " + p, {
                    code: "DAL_03",
                    level: "CDR",
                    meta: {
                        parameter: p
                    }
                });
            returnParams[p] = null;
        }
        return;
    });
    return returnParams;
};

var readSqlDocs = function (conf) {
    const filterFn = item => path.extname(item.path).match(/sql|yaml/);

    let files;
    try {
        files = klawSync(
            path.resolve(conf.sqlDirectory || path.resolve(__app.base, "sql")), {
                filter: filterFn
            }
        );
    } catch (e) {
        throw new __app.error("Failed to get sql Directory content", {
            fatal: true,
            code: "DAL_02",
            level: "APP"
        });
    }

    files.forEach(f => {
        let sqlObject = createSqlObject(f);
        internal.sqls[sqlObject.sqlkey] = sqlObject;
    });
};

async function createSinglePool(dbconf) {
    __app.logger.debug("create Oracle connections pool:", dbconf)

    let pool = await oracledb.createPool(dbconf).catch(e => {
        __app.logger.error(e.stack);
        throw new AppError("Failed to create Oracle connection pool", {
            fatal: true,
            meta: dbconf,
            origError: e
        });
    });
    internal.realPools[dbconf.poolAlias] = pool ; 
    return pool;
}

function matchPool(conf, poolAlias) {
    let groupOfPools = __app.lodash.values(conf.poolsGroups);

    let foundPool = null;

    groupOfPools.forEach(pools => {

        let selectedPool = pools.find((p) => {
            return p.poolAlias === poolAlias;
        })

        if (selectedPool)
            foundPool = selectedPool;
        return;
    })

    return foundPool;
}

async function connectDefault(conf) {
    if (!conf.defaultGroup) {
        throw new AppError(
            "App must have at least one defaultGroup for connections pools ", {
                fatal: true
            }
        );
    }

    let poolConf = __app.lodash.get(conf.poolsGroups, conf.defaultGroup)[0];
    if (!poolConf)
        throw new AppError(
            "defaultGroup not match one of the poolsGroups ! ", {
                fatal: true
            }
        );

    let defaultConf = {
        ...defaultPoolConf,
        ...poolConf,
    };
    internal.pools[poolConf.poolAlias] = await createSinglePool(defaultConf);
    internal.pools.default = internal.pools[poolConf.poolAlias];
    internal.defaultPool = poolConf.poolAlias;
}

async function createPools(conf) {
    let dbs =  __app.lodash.get(__app.local, "bucket.dbs", __app.lodash.get(__app.local, "dbs",[]));
    if(process.env.POOL_ALIAS) 
       dbs = [{db:process.env.POOL_ALIAS,default:true}];
    if(!dbs.length) 
       dbs = [{db:__app.config.defaultPoolAlias,default:true}];

    let pools = [];
     for(let dbinfo of dbs ) { 
        let poolConf = conf.dbs[dbinfo.db];
        poolConf.poolMax = __app.args.groups || dbinfo.poolMax || poolConf.poolMax;
        poolConf.poolMin = __app.args.groups || dbinfo.poolMax || poolConf.poolMin;
 	poolConf.poolAlias = dbinfo.db ;
 	poolConf.default = dbinfo.default;
 	internal.totalConnections += poolConf.poolMax ;
        internal.totalDbConnections[dbinfo.db]  = poolConf.poolMax;
 	pools.push(poolConf);
     }
     process.env.UV_THREADPOOL_SIZE = internal.totalConnections + 1;
     let foundDefault = null;
     for(let poolConf of pools ) { 
        internal.pools[poolConf.poolAlias] = await createSinglePool(poolConf);
        internal.pools[poolConf.poolAlias+"_1"] = internal.pools[poolConf.poolAlias];
 	if(poolConf.default) {
 	   internal.pools.default = internal.pools[poolConf.poolAlias]  ;
           internal.defaultPool = poolConf.poolAlias;
	   foundDefault = true;
	}
    }
    if(!foundDefault) {
     let firstPoolAlias = Object.keys(internal.pools)[0];
     internal.pools.default = internal.pools[firstPoolAlias]  ;
     internal.defaultPool = firstPoolAlias;
    }	
    __app.logger.debug(internal.pools)
}


const init = async function (conf) {
    __app.logger.info("conf:",conf);
    await createPools(__app.config.oracle);
     __app.logger.info("process.env.UV_THREADPOOL_SIZE:",process.env.UV_THREADPOOL_SIZE);
    for(let p in internal.realPools) { 
      // internal.pools[p]._logStats();
      __app.logger.info(`${p} connectionsOpen :`, internal.pools[p].connectionsOpen);
    }

    readSqlDocs(conf);
    internal.conf = conf;
    module.exports.sqls = internal.sqls;
    module.exports.totalConnections = internal.totalConnections;
    module.exports.totalDbConnections = internal.totalDbConnections;
    module.exports.pools = internal.pools;
    module.exports.defaultPool = internal.defaultPool;
    __app.logger.info("Connected pools:", Object.keys(internal.pools).filter((p) => p !== "default"), "default is:", internal.defaultPool)
    return internal;
};

module.exports.init = init;

function getMethod(method) {
    __app.logger.debug("dal method:", method);
    let retMethod;
    switch (method.toLowerCase()) {
        case "query":
        case "getOne":
            retMethod = "query";
            break;
        case "update":
        case "delete":
        case "insert":
            retMethod = "execute";
            break;
        default:
            retMethod = "execute";
    }
    return retMethod;
}

function fetchMethod(sql) {
    var action = sql.match(/^\s?\w+/)[0];
    if (action.match(/select/i)) return "query";
    return "execute";
}

function getReplacement(p) {
    if (typeof p === "undefined" || p == null)
        return null;
    return __app.lodash.toString(p);
}




function setUpperKeys(p = {}) {
    let upperKeysParams = {};

    for (let k in p) {
        upperKeysParams[k.toUpperCase()] = p[k];
    }
    return upperKeysParams;
}


async function setCache(cacheKeys, val, ttl) {
    let t1 = __app.ts();

    await __app.cacheStore.client.hset(cacheKeys.domainKey, cacheKeys.hashKey, val).catch(e => {
        __app.logger.error("setCache:Failed to save cache in redis", e.stack);
    });

    let currentTtl = await __app.cacheStore.client.ttl(cacheKeys.domainKey);

    if(currentTtl && currentTtl < 1  && ttl) {
    	await __app.cacheStore.client.expire(cacheKeys.domainKey, ttl).catch(e => {
      	  __app.logger.error("setCache:Failed to expire cache in redis", e.stack, cacheKeys.domainKey);
    	});
    }
    __app.logger.debug("dal setCache:", cacheKeys.domainKey, cacheKeys.hashKey, "time:", __app.ts() - t1, "ms")
}



async function getCache(cacheKeys) {
    let t1 = __app.ts();
    let cacheData = await __app.cacheStore.client.hget(cacheKeys.domainKey, cacheKeys.hashKey).catch(e => {
        __app.logger.error("getCache:Failed to hget cache in redis :" + cacheKeys.domainKey + cacheKeys.hashKey, e.stack);
    });


    if (cacheData && cacheData.length > 4) {
        __app.logger.debug("dal getCache:", cacheKeys.domainKey, cacheKeys.hashKey, "time:", __app.ts() - t1, "ms");
        return JSON.parse(cacheData);
    }
    return null;
}

const createResultSchema = function (dalkey, result) {
    if (internal.numbers[dalkey])
        return;

    for (let f in result) {
        if (__app.lodash.isNumber(result[f])) {
            internal.numbers[dalkey] = internal.numbers[dalkey] || {};
            internal.numbers[dalkey][f] = true;
        }
    }
}


async function getOneSetCache(cacheKey, val, ttl) {
    let sts = await __app.cacheStore.client.hmset(cacheKey, val).catch(e => {
        __app.logger.error("getOneSetCache:Failed to save cache in redis", e.stack, cacheKey, val);
    });

    __app.cacheStore.client.expire(cacheKey, ttl).catch(e => {
        __app.logger.error("getOneSetCache:Failed to expire cache in redis", e.stack, cacheKey, val);
    });

}

async function getOneGetCache(cacheKey, dalkey) {

    let cacheData = await __app.cacheStore.client.hgetall(cacheKey).catch(e => {
        __app.logger.error("getOneGetCache:Failed to get cache in redis", e.stack);
    });

    if (Object.keys(cacheData || {}).length) {
        let validResult = {};
        for (let f in cacheData) {
            if (internal.numbers[dalkey] && internal.numbers[dalkey][f]) {
                happend = true;
                validResult[f] = __app.lodash.toNumber(cacheData[f]);
            } else {
                validResult[f] = cacheData[f];
            }

        }

        return [validResult];
    }

    return null;
}


function getSqlObject(str) {
    let sqlObject;
    if (str.match(" ")) {
        sqlObject = createSqlObject(str);
    } else {
        if (!internal.sqls[str]) {
            __app.logger.error("exists sqls:",Object.keys(internal.sqls));
            throw new AppError("sql file (" + str + ") is not found !", {
                fatal: true
            });
        }
        sqlObject = internal.sqls[str];
    }
    return sqlObject;
}


async function executeSql(method, sqlObject, params, options) {

      options.conn = options.conn || options.connection;

    options.autoCommit = options.autoCommit || options.commit;

    if (__app.local.useRedisFlag === 'N') options.ttl = 0;
    let startExeSql = __app.ts();
    __app.logger.perf("start executeSql:", options.$id, startExeSql);

    //params = setUpperKeys(params);
    let oracledbMethod = getMethod(method);
    let conn;
    let result;
    let sanitizedParams;


   

    let sqlStm = sqlObject.sql;

    if (sqlObject.dynamic) {
        //set dynamic sql
        var dynSql = sqlStm;
        sqlObject.sql.match(/{{(\w+)}}/g).forEach(v => {
            v = v.replace(/{{|}}/g, "");
            let replacement = getReplacement(params[v.toUpperCase()]);
            dynSql = dynSql.replace(
                new RegExp("{{" + v + "}}", "ig"),
                replacement
            );
            return;
        });
        sqlStm = dynSql;
    }

    let dalError;
    let getConnectionTime =0;
    try {
        sanitizedParams = sanitize(sqlObject.inSqlParams, params, options);
        if (options.conn) {
            conn = options.conn;
            __app.logger.debug("get connection from dal options")
        } else {
            let tc1 = __app.ts();
            conn = await getConnection(options.poolAlias).catch(e => {
                throw new AppError(
                    "Failed to get DB connection from " + (options.poolAlias || internal.defaultPool) + " pool" + "reason:" + e.message, {
                        fatal: true
                    }
                );
            });
            getConnectionTime =   __app.ts() - tc1;
            __app.logger.perf("after get connection:", options.poolAlias, options.$id, getConnectionTime)
        }


        if(options.debug) 
           logger.info("DAL statement:", sqlStm);
        logger.debug("DAL statement:", sqlStm);
        logger.debug("DAL parameters:", params);
        logger.debug("Sanitized  parameters:", sanitizedParams);
        logger.debug("DAL options:", options);

        let startDalExec = __app.ts();
        __app.logger.perf("before execute sql :", options.$id, startDalExec);

        result = await conn[oracledbMethod](sqlStm, sanitizedParams, options);
	let endDalExec = __app.ts();
        __app.logger.perf("after execute sql :", options.$id, endDalExec);
        let dalExecMs = endDalExec - startDalExec;
        if (dalExecMs > __app.config.slowDalMS) {
            __app.logger.info("slow dal :",sqlObject.sqlkey, dalExecMs, "ms, getConnectionTime:",getConnectionTime,"ms");
        }
    } catch (e) {
        
        __app.logger.error("pool:",internal.pools[options.poolAlias],"def:",internal.defaultPool);

        __app.logger.error("bad sql exe: " + sqlObject.sqlkey + " > " + e.message, {
                poolAlias: options.poolAlias,
                dynamic: sqlObject.dynamic,
                inSqlParams: sqlObject.inSqlParams,
                sql: sqlStm,
                sanitizedParams: sanitizedParams,
                sentParams: params,
        });

        dalError = new AppError("bad sql exe: " + sqlObject.sqlkey + " > " + e.message, {
            code: "DAL_04",
            meta: {
                poolAlias: options.poolAlias,
                dynamic: sqlObject.dynamic,
                inSqlParams: sqlObject.inSqlParams,
                sql: sqlStm,
                sanitizedParams: sanitizedParams,
                sentParams: params,
            }
        });
    }

    if (conn && !options.conn) await conn.release();
    if (dalError)
        throw dalError;

    return result;
}

let connectionTimeout = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timed out waiting for Oracle connection'));
        }, CONNECTION_TIMEOUT);
    })
}



async function getConnection(poolAlias = null) {
    poolAlias = poolAlias || internal.defaultPool;
    let t1 = __app.ts();

    logger.debug("Get connection -> poolAlias:", poolAlias, "where default pool is:", internal.defaultPool);
    let selectedPool = internal.pools[poolAlias];
    let connection = await Promise.race([selectedPool.getConnection(), connectionTimeout()]).catch(e => {
        throw e;
    });

    let t2 = __app.ts();

    if ((t2 - t1) > __app.config.slowConnectionMS) {
        internal.pools[poolAlias]._logStats();
        __app.logger.info("Slow getConnection !", "connectionsInUse:", internal.pools[poolAlias].connectionsInUse, "connectionsOpen:", internal.pools[poolAlias].connectionsOpen, t2 - t1, " ms")
    }
    return connection;
}

module.exports.getConnection = getConnection;

module.exports.getPool = function (alias) {
    return oracledb.getPool(alias);
}


function getCacheKeys(sqlObject, params) {
    let cacheDomain = sqlObject.cacheDomain || sqlObject.sqlkey;
    let domainKey = cacheDomain + ":" + (params[__app.config.cache.domains[sqlObject.cacheDomain]] || "");
    let hashKey = hash({
        sqlStm: sqlObject.sqlkey,
        params: params
    });

    return {
        sqlkey: sqlObject.sqlkey,
        domainKey: __app.cacheStore.getKey(__app.config.memPrefix.dal + ":" + domainKey),
        hashKey: hashKey
    };
}

module.exports.getDomainKey = function (domainKey = "", val) {
    return __app.cacheStore.getKey(__app.config.memPrefix.dal + ":" + domainKey + ":" + val);
}

module.exports.delCache = function (domainKey = "", val) {
    let redisKey = __app.cacheStore.getKey(__app.config.memPrefix.dal + ":" + domainKey + ":" + val);
    return __app.cacheStore.client.del(redisKey).catch(e => {
        __app.logger.error("Failed to delete ", redisKey, e.stack)
    })
}


module.exports.query = async function (sqlkey, params, options = {}) {
    let result;
    let cacheResult;
    let hashKey;
    let cacheKeys;
    let sqlObject = getSqlObject(sqlkey);


    if (options.ttl && sqlObject.allowCache == true) {
        cacheKeys = getCacheKeys(sqlObject, params);
        cacheResult = await getCache(cacheKeys);
        if (cacheResult && cacheResult.length)
            return cacheResult;
    }

    result = await executeSql("query", sqlObject, params, options);
    if (options.mustFound && !result.length) {
        //if (options.conn) await options.conn.release();
        throw new AppError(
            sqlObject.sqlkey + " Query result retreive NOT_FOUND when data must be returned", {
                code: sqlObject.errorClass || "DAL_03",
                level: "CDR",
                meta: {
                    params: params
                }
            }
        );
    }

    if (!result.length) return null;
    if (options.ttl && sqlObject.allowCache == true) {
        await setCache(cacheKeys, JSON.stringify(result), options.ttl);
    }
    return result;
};
module.exports.getPoolInfo = function (alias) {
    return internal.poolsInfo[alias] || {};
}
module.exports.getOne = async function (
    sqlkey,
    params,
    options = {},
    defValue = null
) {
    options.method = "getOne";
    let result = await module.exports.query(sqlkey, params, options || {});
    if (result && result.length) {
        return result[0];
    }
    return defValue;
};

module.exports.queryStream = async function (sqlkey, params, options = {}) {
    let stream;
    let sqlObject = getSqlObject(sqlkey);
    options.streamResults= true ;
    options.fetchArraySize = options.fetchArraySize || 150 ;
    stream = await executeSql("query", sqlObject, params, options);
    return stream;
};


module.exports.update = async function (sqlkey, params, options) {
    let result = await executeSql("update", getSqlObject(sqlkey), params, options || {});
    return addSuccessEntity(result);
};
module.exports.delete = async function (sqlkey, params, options) {
    let result = await executeSql("delete", getSqlObject(sqlkey), params, options || {});
    return addSuccessEntity(result);
};

module.exports.insert = async function (sqlkey, params, options) {
    let result = await executeSql("insert", getSqlObject(sqlkey), params, options || {});
    return addSuccessEntity(result);
};



module.exports.execute = async function (sqlkey, params, options) {
    let result = await executeSql("update", getSqlObject(sqlkey), params, options || {});
    return addSuccessEntity(result)
};

module.exports.concurrent = async function (tasks) {
    return await Promise.all(tasks);
};

module.exports.getMetaData = async function (tableName, options) {
    // let sqlObject = getSqlObject("select * from " + tableName + " where 1=2");

    let result = await executeSql("execute", getSqlObject("select * from " + tableName + " where 1=2"), {}, options || {});
    return result.metaData;
}

module.exports.fetchMethod = fetchMethod;
module.exports.oracledb = oracledb;

module.exports.getCache = async function(sqlkey,params) {
    let cacheKeys = getCacheKeys(getSqlObject(salKey), params);
    // __app.logger.info("cacheKeys:", cacheKeys)
    cacheResult = await getCache(cacheKeys);
    return cacheResult;
}


module.exports.setCache = async function(sqlkey,val,ttl=10000) {
    let storeVal ;
    if(typeof val == 'object') 
 	storeVal = JSON.stringify(val) ;
    else 
 	storeVal = val ;
    let cacheKeys = getCacheKeys(getSqlObject(sqlkey), params);
    return await setCache(cacheKeys, storeVal , ttl);
}

const genericGetCacheKeys   = function(domain,key,params) { 
	return getCacheKeys({cacheDomain:domain,sqlkey:key},params); 
}

module.exports.genericGetCacheKeys = genericGetCacheKeys ;
 

module.exports.genericGetCache = async function(domain ,key,params,defVal=null) {
   let cacheKeys = genericGetCacheKeys(domain,key,params);
   cacheResult = await getCache(cacheKeys) || defVal;
   return cacheResult;
}
module.exports.genericSetCache = async function(domain ,key,params,val) {
    let storeVal ;
    if(typeof val == 'object')
        storeVal = JSON.stringify(val) ;
    else
        storeVal = val ;
    let cacheKeys = genericGetCacheKeys(domain,key,params);
    return await setCache(cacheKeys,storeVal);
}
