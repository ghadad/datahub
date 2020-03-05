const internals = {}

const hl  = require("highland");
const delay = require("delay");

exports = module.exports = class {
    constructor(config) {
        this.name = "db query  collector"
        this.config = config;
        if (!this.config.dbAlias) throw new Error("missing db alias");

    }

    getKey(data) {
        if (this.config.pkField)
            return data[this.config.pkField];
        else if (this.config.pkHandler)
            return this.config.pkHandler(data);
        throw new Error("Failed to get key query result ", data)
    }

    async getStream(query, params) {
        let self = this;
        return await __app.dal.queryStream(query, params);
    }
    async init() {
        __app.logger.info("get dal by dbalias:", this.config.dbAlias)
        this.knex = __app.dal.getDal(this.config.dbAlias);
        if (!this.knex) {
            let dbConfig = await __app.couchDb.get("databases", this.config.dbAlias);
            dbConfig.dbAlias = this.config.dbAlias;
            this.knex = __app.dal.init(dbConfig._id,dbConfig.db);
            console.log("db:",dbConfig.db)
            if (!this.knex) throw new Error("Failed to get dal connection:" + this.config.dbAlias)
        }
    }


    async fetchInfo() {
        let self = this;
        let result = await self.test(1);    
        
        if(result[0])
            return Object.keys(result[0]);
            throw "Canot";
    }
    
    test(limit = 5) {
        let self = this;
        let reader;
        return new Promise(async function (resolve, reject) {

            reader = await self.knex.raw(self.config.query).stream();

            let sampledRows = [];
            let index = 0;
            async function itter(readable) {
                for await (let data of readable) {
                    data.$index = index;
                    sampledRows.push(data);
                    index++;
                    if (index >= limit) break;
                }
                resolve(sampledRows);
            }

            if (!reader)
                return reject(new Error(`Failed to create reader stream`));
            await itter(reader).catch(e => {
                reject(e);
            });
        })
    }

    async collect(flow) {
        let self = this;
        let cdrList = [];
        let ratedUsgaes = [];
        // let stream = await self.getStream();
        __app.logger.info(this.config.query)
        console.log("START Qureing ",__app.ts("pretty"))
        var queryStream = this.knex.raw(this.config.query).stream();

        let dataStream = hl(queryStream).map(function (data) {
            return hl(flow(data))
        }).parallel(10);
        return new Promise(function (resolve,reject) { 
            dataStream.done(function() { 
                console.log("DONE",__app.ts("pretty"),idx)
                resolve("DONE")
            });
        })

       
    }
    
}