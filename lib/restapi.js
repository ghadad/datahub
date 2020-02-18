const csv = require("fast-csv");
const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request-promise");

const internals = {}

exports = module.exports = class CsvReader {
    constructor(config) {
        this.name = "REATAPI  collector"
        this.config = config;

        __app.logger.info("after REATAPI constructor:", this.config)

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
        if (typeof keyValue == "undefined" || keyValue == null) {
            __app.logger.error("Failed to get key value :", this.config.keyType, this.config.pkSource, data)
            throw new Error("Failed to get key for csv cdr")
        }
        console.log("keyVal:", keyValue, this.config.keyType, this.config.pkSource)

        return keyValue;
    }

    init() {

    }


   async  fetchInfo() {
        let self = this;
        let result;
        let headers = {};
        self.config.headers.filter(e => e.name && e.value).forEach(e => headers[e.name] = e.value);
        const options = {
            url: self.config.sourcePath,
            headers: headers
        };

        result = await request(options);
        
        try {
            let retJson;
            if (typeof result == "string")
                retJson = JSON.parse(result);
            else
                retJson = JSON.parse(result);
            if (self.config.dataPath)
                return Object.keys(__app.lodash.get(retJson, self.config.dataPath+'[0]', {}))
            return Object.keys(__app.lodash.get(retJson, '[0]', {}));

        } catch (e) {
            throw new Error("Failed to parse apirest answer" + e.stack)
        }
    }


    async test(limit = 5) {
        let self = this;
        let result;
        let headers = {};
        self.config.headers.filter(e => e.name && e.value).forEach(e => headers[e.name] = e.value);
        const options = {
            url: self.config.sourcePath,
            headers: headers
        };

        result = await request(options);

        try {
            let retJson;
            if (typeof result == "string")
                retJson = JSON.parse(result);
            else
                retJson = JSON.parse(result);
            if (self.config.dataPath)
                return  __app.lodash.get(retJson, self.config.dataPath, []).slice(0,limit)
            return retJson.slice(0,limit);

        } catch (e) {
            throw new Error("Failed to parse apirest answer" + e.stack)
        }
    }

    collect(flow) {
        let self = this;
        __app.logger.info("in csv collector", this.config)
        return new Promise(async function (resolve, reject) {
            let reader;
            if (self.config.sourcePath.match(/^http/i))
                reader = request(self.config.sourcePath)
            else
                reader = fs.createReadStream(self.config.sourcePath);

            let index = 0;
            if (!reader)
                return reject(new Error(`Failed to read file:${self.config.sourcePath}`));
            reader.pipe(csv.parse({
                    delimiter: self.config.seperator || ",",
                    renameHeaders: self.config.renameHeaders || false,
                    discardUnmappedColumns: true,
                    headers: self.config.properties
                }))
                // async transform
                .transform(async (data, cb) => {
                    data.$index = index;
                    index++;
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
