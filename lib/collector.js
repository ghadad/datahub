const internals = {}
const CsvReader = require("./csv");
const QueryReader = require("./query")
exports = module.exports = class {
    constructor(config) {
        this.config = config;
        this.type = this.config.sourceType;
        switch (this.type) {
            case "csv":
                __app.logger.info("collector config:", this.config)
                this.reader = new CsvReader(this.config);
                break;
            case "sql":
                this.reader = new QueryReader(this.config);
                break;
            default:
                throw new Error(`cannot get reader by  sourceType=${this.type}`)
        }

    }
    getKey(data) {
        return this.reader.getKey(data);
    }
    async collect(flow) {
        await this.reader.init();
        await this.reader.collect(flow).catch(e => __app.logger.error(e.stack));
    }
    getConfig() {
        return this.config;
    }
    async query() {}
}