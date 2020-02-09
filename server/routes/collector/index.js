const upath = require("upath");
const rfs = require("require-from-string");

const Collector = require(upath.join(__app.lib, "collector"));
const Mapper = require(upath.join(__app.lib, "mapper"));

module.exports = function (fastify, opts, next) {
    fastify.post('/test', async function (req, res, next) {
        let collector = new Collector(req.body);
        return await collector.test(5)
    });

    fastify.post('/test2', async function (req, res, next) {
        let collector = new Collector(req.body.config);
        console.log("req.body.config.handler:", req.body.handler)
        let collectorPostHandler = rfs('module.exports = ' + req.body.handler);

        let collectorData = await collector.test(5)
        for (let row of collectorData) {
            row = await collectorPostHandler(row)
        }
        return collectorData;
    });

    fastify.post('/test3', async function (req, res, next) {
        let collector = new Collector(req.body.config);
        console.log("req.body.config.handler:", req.body.handler)
        let collectorPostHandler = rfs('module.exports = ' + req.body.handler);

        let collectorData = await collector.test(5)
        for (let row of collectorData) {
            row = await collectorPostHandler(row)
        }

        let mapper = new Mapper(this.config.mapping.config);


        return collectorData;
    });

    next()
}