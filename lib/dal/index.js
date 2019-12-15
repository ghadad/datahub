const knex = require("knex");
module.exports = class Dal {
    constructor(config) {
        this.config = config
    }
    async init(dbConfig) {
        __app.logger.info("collector config:", __app.config)
        this.knex = await knex(__app.config.databases[dbConfig.dbAlias]);
        return this.knex;
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