const knex = require("knex");
module.exports = class Dal {
    constructor(config) {
        this.config = config;
        this.dbs = {};
        this.defaultAlias = "";
    }

    async init(dbConfig) {
        __app.logger.info("dbConfig:", dbConfig)
        let db = await knex(dbConfig.config);
        this.dbs[dbConfig.dbAlias] = db;
        if (!this.defaultAlias) this.defaultAlias = dbConfig.dbAlias;
    }

    getDal(alias) {
        return this.dbs[alias] || this.dbs[this.defaultAlias];
    }

    async query(stm, params, options) {
        let result = await this.getDal(options.dbAlias).raw(stm);
        let jsonResult = JSON.parse(JSON.stringify(result[0]))
        return jsonResult;
    }
    async getOne(stm, params = {}, options = {}) {
        let result = await this.query(stm, params, options);
        return result[0]
    }
}