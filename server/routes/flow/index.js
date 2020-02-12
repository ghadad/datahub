const upath = require("upath");
const rfs = require("require-from-string");

const Collector = require(upath.join(__app.lib, "collector"));
const Mapper = require(upath.join(__app.lib, "mapper"));
const fetchInfo = async function(flow) { 
    let collector = new Collector(flow.collector.config);
    let result = await collector.fetchInfo()
    return result;
}
const flowExe = async function (flow, step) {

    let collector = new Collector(flow.collector.config);

    console.log("flow.collector.handler:", flow.collector.handler)
    let collectorPostHandler = rfs('module.exports = ' + flow.collector.handler);
    let mappingPostHandler = rfs('module.exports = ' + flow.mapping.handler);

    let result = await collector.test(5)
    if (step == "collector")
        return result;

    for (let row of result) {
        row = await collectorPostHandler(row)
    }
    if (step == "collector_handler")
        return result;

    let mapper = new Mapper(flow.mapping.config);

    let mappedData = [];
    for (let row of result) {
        mappedData.push(await mapper.map(row))
    }


    if (step == "mapping")
        return mappedData;

    for (let row of mappedData) {
        row = await mappingPostHandler(row)
    }

    return mappedData;

}

module.exports = function (fastify, opts, next) {
    fastify.post('/test/:what', async function (req, res, next) {
        let result = await flowExe(req.body, req.params.what);
        return result;
    });
    fastify.post('/fetch-info/', async function (req, res, next) {
        let result = await fetchInfo(req.body);
        return result;
    });
    next()
}