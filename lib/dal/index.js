const knex = require("knex");
module.exports = class Dal {
    constructor(config) {
        this.config = config;
        this.dbs = {};

    }
    async init(dbConfig) {
        __app.logger.info("dbConfig:", dbConfig)
        this.knex = await knex(dbConfig.config);
        this.dbs[dbConfig.dbAlias] = this.knex;
    }

    getKnexByAlias(alias) {
        return this.dbs[alias];
    }

    async query(stm) {
        let result = await this.knex.raw(stm);
        let jsonResult = JSON.parse(JSON.stringify(result[0]))
        return jsonResult;
    }
    async getOne(stm) {
        let result = await this.query(stm);
        return result[0]
    }
}