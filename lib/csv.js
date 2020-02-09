const csv = require("fast-csv");
const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request");

const internals = {}

exports = module.exports = class CsvReader {
    constructor(config) {
        this.name = "csv collector"
        this.config = config;

        __app.logger.info("after csv constructor:", this.config)

        if (this.config.keyType == 'handler') {
            this.config.pkSource = rfs('module.exports = ' + this.config.pkSource)
        }
    }

    getKey(data) {
        let keyValue;
        if (this.config.keyType == 'index')
            keyValue = Object.values(data)[this.config.pkSource];
        else if (this.config.keyType == 'property')
            keyValue = data[this.config.pkSource];
        else if (this.config.keyType == 'handler')
            keyValue = this.config.pkSource(data);
        if (!keyValue) {
            __app.logger.error("Failed to get key value :", this.config.keyType, this.config.pkSource, data)
            throw new Error("Failed to get key for csv cdr")
        }
        console.log("keyVal:", keyValue, this.config.keyType, this.config.pkSource)

        return keyValue;
    }

    init() {

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
    let transform = async (data, cb) => {
        try {
                    data._id = self.getKey(data);                  
                    sampledRows.push(data);
        } catch (error) {
            reject(error)
        }
            
                    if(sampledRows.length >= limit )
                         return resolve(sampledRows)
                    cb(null,data);
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

    collect(flow) {
        let self = this;
        __app.logger.info("in csv collector", this.config)
        return new Promise(async function (resolve, reject) {
            let reader = fs.createReadStream(self.config.sourcePath);
            let index = 0;
            if (!reader)
                return reject(new Error(`Failed to read file:${self.config.sourcePath}`));
            reader.pipe(csv.parse({
                    discardUnmappedColumns: true,
                    headers: self.config.properties
                }))
                // async transform
                .transform(async (data, cb) => {
                    console.log("in transform", data)
                    data._id = self.getKey(data);
                    let newData = await flow(data);
                    cb(null, newData)
                })
                .on("data", async function (data) {
                    //    reader.pause();
                    //    let newData = await flow(data);
                    //    newData._id = self.getKey(newData);
                    //    reader.resume();
                })
                .on("end", async function () {
                    __app.logger.info("finish reading csv file:")
                    resolve({
                        success: true
                    });
                })
                .on("error", (err) => {
                    return reject("Failed on csvReading:" + err.stack);
                });
        })
    }
}