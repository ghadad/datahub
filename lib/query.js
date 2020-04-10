const internals = {}
const rfs = require("require-from-string");

const hl = require("highland");
const delay = require("delay");

exports = module.exports = class {
    constructor(config) {
        this.name = "db query  collector"
        this.config = config;
        if (!this.config.dbAlias) throw new Error("missing db alias");

        if (this.config.keyType == 'pkHandler') {
            this.config.pkHandler = rfs('module.exports = ' + this.config.pkHandler)
        }

    }

    getKey(data) {
        if (this.config.pkField)
            return data[this.config.pkField];
        else if (this.config.pkHandler)
            return this.config.pkHandler(data);
        throw new Error("Failed to get key query result ! no method or value selected", data)
    }

    async getStream(query, params) {
        let self = this;
        return await __app.dal.queryStream(query, params);
    }

    async init() {

        this.knex = __app.dal.getDal(this.config.dbAlias);
        __app.logger.info("get dal by dbalias:", this.knex)

        if (!this.knex) {
            console.log("INIT DAL")
            let dbConfig = await __app.couchDb.get("databases", this.config.dbAlias);
            dbConfig.dbAlias = this.config.dbAlias;
            this.knex = __app.dal.init(dbConfig._id, dbConfig.db);

            if (!this.knex) throw new Error("Failed to get dal connection:" + this.config.dbAlias)
        }
    }


    async fetchInfo() {
        let self = this;
        await self.init();
        try {
            let result = await self.test(1);
            if (result[0])
                return Object.keys(result[0]);
        } catch (e) {
            throw new __app.error("Failed to test query " + e.message)
        }



    }

    async test(limit = 5) {
        let self = this;
        let reader;
        await self.init();
        var queryStream = this.knex.raw(this.config.query).stream();
        return new Promise(function (resolve, reject) {
            let dataStream = hl(queryStream).stopOnError(e => reject(e)).take(limit)

            dataStream.map(function (data) {
                let result = data;
                try {
                    result._id = self.getKey(data);
                } catch (e) {
                    result.$error = {
                        stage: "getKey",
                        message: e.message
                    };
                }
                return result;
            }).toArray(function (xs) {
                queryStream.end();
                resolve(xs);
            })
        })
    }

    async collect(flow, bulkFlow) {
        let self = this;
        let cdrList = [];
        let ratedUsgaes = [];
        // let stream = await self.getStream();
        __app.logger.info(this.config.query)
        let t1 = __app.ts();
        console.log("START Qureing ", __app.ts("pretty"))
        var queryStream = this.knex.raw(this.config.query).stream();
        let idx = 0;

        return new Promise(function (resolve, reject) {
            let dataStream = hl(queryStream).stopOnError(e => reject(e)).map(function (data) {
                idx++;
                if (idx % 1000 == 1)
                    console.log(__app.ts("pretty"), "IDX till now :", idx)
                return hl(flow(data))
            }).parallel(15);

            dataStream
                .filter(function (data) {
                    return __app.lodash.get(data, '$error.code') == 'DROP';
                })
                .batch(1000).flatMap(function (data) {
                    return hl(bulkFlow(data));
                }).done(function () {
                    //release knex connection
                    queryStream.end();
                    console.log("DONE", __app.ts("pretty"), idx, (__app.ts() - t1), "ms")
                    return resolve("DONE")
                });
        })


    }

}