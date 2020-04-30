const internals = {}
const CsvReader = require("./csv");
const QueryReader = require("./query");
const APIReader = require("./restapi")
const SystemDBReader = require("./systemdb")

exports = module.exports = class {
    constructor(config) {
        this.config = config;
        this.type = this.config.sourceType;
        switch (this.type) {
            case "csv":
                this.reader = new CsvReader(this.config);
                break;
            case "systemDB":
                this.reader = new SystemDBReader(this.config);
                break;
            case "query":
                this.reader = new QueryReader(this.config);
                break;
            case "restapi":
                this.reader = new APIReader(this.config);
                break;
            default:
                throw new Error(`cannot get reader by  sourceType=${this.type}`)
        }

    }

    getKey(data) {
        try {
            return this.reader.getKey(data);
        } catch (e) {
            throw new __app.error(`failed to retreive key/_id : ${e.message}`, {
                code: "FATALROW"
            })
        }

    }
    async collect(flow, flowBulkUpsert, concurrency, batchSize) {
        await this.reader.init();
        let collectorStatus = await this.reader.collect(flow, flowBulkUpsert, concurrency, batchSize);
        __app.logger.debug("collectorStatus:", collectorStatus);
        return collectorStatus;
    }

    async fetchInfo() {
        await this.reader.init();
        let result = await this.reader.fetchInfo();
        return result;
    }


    async test(maxSampleRows = 10) {
        await this.reader.init();
        try {
            let result = await this.reader.test(maxSampleRows)
            return result;
        } catch (e) {
            throw new Error("test failed :" + e.message)
        }
    }

    getConfig() {
        return this.config;
    }
    async query() {}
}