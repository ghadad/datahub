const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request");
const hl = require("highland");
const delay = require("delay");
const JSONStream = require("JSONStream")
const internals = {}

exports = module.exports = class RestAPI {
    constructor(config) {
        this.name = "System DB   collector"
        this.config = config;

        __app.logger.info("after System DB constructor:", this.config)

        if (this.config.keyType == 'pkHandler') {
            this.config.pkHandler = rfs('module.exports = ' + this.config.pkHandler)
        }
        this.config.dataPath =
            (this.config.dataPath || '*')
            .trim()
            .replace(/(\w)$/, "$1.*")

    }

    getKey(data) {

        let keyValue;
        if (this.config.keyType == 'pkPath')
            keyValue = __app.lodash.get(data, this.config.pkPath, null);
        else if (this.config.keyType == 'pkField')
            keyValue = __app.lodash.get(data, this.config.pkField, null);
        else if (this.config.keyType == 'pkHandler')
            keyValue = this.config.pkHandler(data);

        if (keyValue == null || typeof keyValue == "undefined") {
            __app.logger.error("Failed to get key query result ,flow config", this.config)
            throw new Error(`Failed to get key query result keyType=${this.config.keyType}`);
        }

        return keyValue;
    }

    init() {

    }


    async fetchInfo() {
        let self = this;
        let result;

        result = await this.test(2);
        return Object.keys(__app.lodash.get(result, '[0]', {}));
    }

    async test(limit = 5) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let stream = __app.couchDb.findAsStream(self.config.sourceEntity, self.config.initialFilter || {});
            let idx = 0
            hl(stream)
                .stopOnError(e => reject(e))
                .take(limit)
                .toArray(function (xs) {
                    resolve(xs);
                })
        })
    }

    async collect(flow, bulkFlow, concurrency = 10, batchSize = 100) {
        let self = this;
        let headers = {};

        __app.logger.info("START Stream request result  ", __app.ts("pretty"))
        console.log(self.config.initialFilter)
        let t1 = __app.ts();
        let stream = __app.couchDb.findAsStream(self.config.sourceEntity, self.config.initialFilter);
        let idx = 0;
        let dataStream = hl(stream)
            .map(function (data) {
                idx++;
                if (idx % 1000 == 1)
                    __app.logger.info("processed :", idx);
                return hl(flow(data))
            }).parallel(concurrency);

        return new Promise(function (resolve, reject) {
            dataStream
                .filter(function (data) {
                    if (data.$skip || __app.lodash.get(data, '$error.code') == 'DROP')
                        return false;
                    return true;
                }).map(function (data) {
                    console.log(data);
                    return data;
                }).batch(batchSize)
                .flatMap(function (data) {
                    return hl(bulkFlow(data));
                })
                .done(function () {
                    let ms = (__app.ts() - t1);
                    __app.logger.info("processed :", idx)
                    return resolve({
                        ok: true,
                        rows: idx,
                        secs: ms / 1000,
                        rps: Math.round(idx / (ms / 1000))
                    })
                });
        })


    }


}