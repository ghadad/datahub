const knex = require("knex");

module.exports = class Dal {

    constructor(config) {
        this.config = config;
        this.dbs = {};
        this.defaultAlias = "";
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