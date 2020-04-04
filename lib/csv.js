const csv = require("fast-csv");
const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request");
const hl = require("highland");


const internals = {}

exports = module.exports = class CsvReader {
    constructor(config) {
        this.name = "csv collector"
        this.config = config;

        if (this.config.keyType == 'pkHandler') {
            this.config.pkHandler = rfs('module.exports = ' + this.config.pkHandler)
        }
    }

    getKey2(data) {
        let keyValue;
        if (this.config.keyType == 'index')
            keyValue = Object.values(data)[this.config.pkSource];
        else if (this.config.keyType == 'property')
            keyValue = data[this.config.pkSource];
        else if (this.config.keyType == 'handler')
            keyValue = this.config.pkSource(data);
        if (typeof keyValue == "undefined" || keyValue == null) {
            __app.logger.error("Failed to get key value :", this.config.keyType, this.config.pkSource, data)
            throw new Error("Failed to get key for csv cdr")
        }
        console.log("keyVal:", keyValue, this.config.keyType, this.config.pkSource)

        return keyValue;
    }

    getKey(data) {
        if (this.config.pkField)
            return data[this.config.pkField];
        else if (this.config.pkHandler)
            return this.config.pkHandler(data);
        throw new Error("Failed to get key query result ! no method selected", data)
    }


    init() {

    }


    fetchInfo() {
        let self = this;
        return new Promise(async function (resolve, reject) {

            let reader;
            if (self.config.sourcePath.match(/^http/i))
                reader = request(self.config.sourcePath)
            else
                reader = fs.createReadStream(self.config.sourcePath);

            if (!reader)
                return reject(new Error(`Failed to read file:${self.config.sourcePath}`));
            reader.pipe(csv.parse({})).on("data",
                    async function (data) {
                        resolve(data);
                    })
                .on("end", async function () {
                    return resolve();
                })
                .on("error", (err) => {
                    return reject("Failed on csvReading:" + err.stack);
                });
        })
    }


    test(limit) {
        let self = this;
        return new Promise(async function (resolve, reject) {

            let sampledRows = [];
            let reader;
            if (self.config.sourcePath.match(/^http/i))
                reader = request(self.config.sourcePath)
            else
                reader = fs.createReadStream(self.config.sourcePath);

            if (!reader)
                return reject(new Error(`Failed to read file:${self.config.sourcePath}`));
            let index = 0;

            let transform = async (data, cb) => {
                try {
                    data.$index = index;
                    index++;
                    console.log("data.$index:", data.$index)
                    data._id = self.getKey(data);
                    sampledRows.push(data);
                } catch (error) {
                    reject(error)
                }

                if (sampledRows.length >= limit)
                    return resolve(sampledRows)
                cb(null, data);
            };

            reader.pipe(csv.parse({
                    discardUnmappedColumns: true,
                    headers: self.config.properties
                }))
                // async transform
                .transform(transform).on("data",
                    async function (data) {

                    })
                .on("end", async function () {
                    return resolve(sampledRows);
                })
                .on("error", (err) => {
                    return reject("Failed on csvReading:" + err.stack);
                });
        })
    }

    collect(flow, bulkFlow) {
        let self = this;
        let reader;
        if (self.config.sourcePath.match(/^http/i))
            reader = request(self.config.sourcePath)
        else
            reader = fs.createReadStream(self.config.sourcePath);

        let index = 0;
        if (!reader)
            return reject(new Error(`Failed to read file:${self.config.sourcePath}`));
        let t1 = __app.ts();
        console.log("START stream csv parser ", __app.ts("pretty"))

        let idx = 0;
        let stream = reader.pipe(csv.parse({
            delimiter: self.config.seperator || ",",
            renameHeaders: self.config.renameHeaders || false,
            discardUnmappedColumns: true,
            headers: self.config.properties
        }));
        let dataStream = hl(stream).map(function (data) {
            idx++;
            if (idx % 1000 == 1)
                console.log(__app.ts("pretty"), "IDX till now :", idx)
            return hl(flow(data))
        }).parallel(15);

        return new Promise(function (resolve, reject) {
            dataStream.filter(function (data) {
                return __app.lodash.get(data, '$error.code') == 'DROP';
            }).batch(1000).flatMap(function (data) {
                return hl(bulkFlow(data));
            }).done(function () {
                console.log("DONE", __app.ts("pretty"), idx, (__app.ts() - t1), "ms")
                return resolve("DONE")
            });
        });


    }
}