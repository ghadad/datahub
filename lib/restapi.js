const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request-promise");
const hl = require("highland");
const delay  = require("delay");

const internals = {}

exports = module.exports = class RestAPI {
    constructor(config) {
        this.name = "REATAPI  collector"
        this.config = config;

        __app.logger.info("after REATAPI constructor:", this.config)

        if (this.config.keyType == 'pkHandler') {
            this.config.pkHandler = rfs('module.exports = ' + this.config.pkHandler)
        }

    }

    getKey(data) {
       
        let keyValue;
        if (this.config.pkField)
            return data[this.config.pkField];
        else if (this.config.pkHandler)
            return this.config.pkHandler(data);
        throw new Error("Failed to get key query result ! no method selected", data)

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

    async collect(flow, bulkFlow) {
        let self = this;
            let headers = {};
        self.config.headers.filter(e => e.name && e.value).forEach(e => headers[e.name] = e.value);
        const options = {
            url: self.config.sourcePath,
            headers: headers,
            json:true

        };
        
        __app.logger.info("START Stream request result  ", __app.ts("pretty"))

        let t1 = __app.ts();
        let stream =  request(options).catch(e=>console.log(e));

        let idx = 0;
        let dataStream = hl(stream)

       hl(stream)
       .collect()
       .map(function (data) {
          
            idx++;
            if (idx % 1000 == 1)
                console.log(__app.ts("pretty"), "IDX till now :", idx)
                return hl(flow(data))
        }).parallel(1);

        return new Promise(function (resolve, reject) {
            dataStream
            .map(x=>console.log(x))
            .map(function (data) {
                __app.logger.info("data:",data)
                         return hl(bulkFlow(data));
            }).done(function () {
                console.log("DONE", __app.ts("pretty"), idx, (__app.ts() - t1), "ms")
                return resolve("DONE")
            });
        })


    }

    
}
