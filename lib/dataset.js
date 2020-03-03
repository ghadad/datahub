const internals = {}
const rfs = require("require-from-string");

exports = module.exports = class Dataset {
    constructor(datasetConfig) {
        this.config = datasetConfig;
    }

    async preload(params) {

    }

    async query(params) {

    }

    async getAll() {
        return await __app.couchDb.getAll("datasets");

    }
}