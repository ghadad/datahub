const csv = require("csv-parser");
const fs = require("fs");

const internals = {}

exports = module.exports = class {
    constructor(collector) {
        __app.logger.info("collector:",collector)
        this.config = collector.config;
        this.handler = collector.handler|| function(data) { console.log("get default handler") ;return data ;}
    }

    getKey(data) {
        if(this.config.pkIndex)
            return Object.values(data)[this.config.pkIndex];
        else if(this.config.pkHeader)    
        return data[this.config.pkHeader];
        else if(this.config.pkHandler)  
            return  this.config.pkHandler(data);
        throw new Error("Failed to get key for csv cdr")         
   }

    async collect(flow) {
        let self = this;
        return await new Promise(function (resolve, reject) {
            let reader = fs.createReadStream(self.config.sourceFile);
            let index=0;
            if (!reader)
                return reject(new Error(`Failed to read file:${self.config.sourceFile}`));
            reader.pipe(csv(__app.config.cdr))
                .on("data", async function (data) {
                    let newData = await flow(data);
                    newData.__id = self.getKey(newData);
                })
                .on("end", async function () {
                    resolve({
                        success: true
                    });
                })
                .on("error", (err) => {
                    return reject("Failed on csvReading");
                });
        })
    }
}