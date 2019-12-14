const knex = require("knex");
module.exports = class Dal {
    constructor(config) {
        this.config = config
    }
    async init(dbConfig) {
        __app.logger.info("collector config:", __app.config)
        return await knex(__app.config.databases[dbConfig.dbAlias]);
    }
}