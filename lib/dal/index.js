const knex = require("knex");

module.exports = class Dal {

    constructor(config) {
        this.config = config;
        this.dbs = {};
        this.defaultAlias = "";
    }

    bindingReplace(sql, params) {
        let arrayParameters = [];
        let newSql = sql.replace(/:\w+/g, function (match) {
            arrayParameters.push(params[match.replace(":", "")]);
            return '?';
        })

        return {
            sql: newSql,
            arrayParameters: arrayParameters
        }
    }

    init(dbAlias, dbConfig) {
        __app.logger.info("dbConfig:", dbAlias, dbConfig);
        dbConfig.pool = {
            min: 0,
            max: 7
        };

        let db = knex(dbConfig);
        this.dbs[dbAlias] = db;
        if (!this.defaultAlias) this.defaultAlias = dbAlias;
    }


    connect(dbConfig) {
        let dbh = knex(dbConfig);
        return dbh;
    }


    getDal(alias) {
        let knex = this.dbs[alias] || this.dbs[this.defaultAlias];
        if (!knex) throw new Error(`No Dal found for alias/defaultAlias :${alias}`);
        return knex;
    }

    async query(stm, params, options) {

        let sqlObject = this.bindingReplace(stm, params);
        let result = await this.getDal(options.dbAlias).raw(sqlObject.sql, sqlObject.arrayParameters);
        let jsonResult = JSON.parse(JSON.stringify(result[0]))
        return jsonResult;
    }
    async getOne(stm, params = {}, options = {}) {

        let result = await this.query(stm, params, options);
        return result[0]
    }
}