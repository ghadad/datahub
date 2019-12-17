const internals = {}

exports = module.exports = class {
    constructor(config) {
        this.name = "db query  collector"
        this.config = config;


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
        this.knex = __app.dal.getDal(this.config.dbAlias)
        return;
        await this.knex.schema.createTableIfNotExists('users', function (table) {
            table.increments('userId');
            table.string('name');
        });
        await this.knex.batchInsert('users', [{
                name: "golan"
            }, {
                name: "maya"
            }], 40)
            .returning('id')
            .then(function (ids) {
                __app.logger.info("ids")
            })


    }
    async collect(flow) {
        let self = this;
        let cdrList = [];
        let ratedUsgaes = [];
        // let stream = await self.getStream();

        var stream = this.knex.select('*').from('users').stream();

        let kavedAvaz = new Promise((resolve, reject) => {
            stream.on('data', async function (data) {
                cdrList.push(data);

            });
            stream.on('error', reject);
            stream.on('end', resolve);
        });
        await kavedAvaz;
        //   if (cdrList.length === 100) {

        // stream.pause();
        for (let r of cdrList) {
            //     __app.logger.info(r)
            await flow(r);
        }

        cdrList = [];
        //stream.resume();
        //  }
        __app.logger.info("After filter data usages , length :", cdrList.length)
        return cdrList;
    }
}