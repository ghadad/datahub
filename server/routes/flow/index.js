const upath = require("upath");
const rfs = require("require-from-string");
const Flow = require(upath.join(__app.lib, "flow"));

const Collector = require(upath.join(__app.lib, "collector"));
const Mapper = require(upath.join(__app.lib, "mapper"));

const fetchInfo = async function (flow) {
    let collector = new Collector(flow.collector.config);
    let result = await collector.fetchInfo()
    return result;
}

const flowExe = async function (flow, step) {
    console.log("flow.collector.handler:", flow.collector.handler)

    let FlowObject = new Flow(flow);
    await FlowObject.init();
    let runFlowHandler = FlowObject.runFlow(FlowObject);

    let collector = new Collector(flow.collector.config);

    console.log("flow.collector.handler:", flow.collector.handler)
    let collectorPostHandler = rfs('module.exports = ' + flow.collector.handler);
    let mappingPostHandler = rfs('module.exports = ' + flow.mapping.handler);
    let resultSet = {};

    let result = await collector.test(5);

    if (step == "collector")
        return result;


    for (let row of result) {
        row = await runFlowHandler(row, step)
    }
    return result;

}

module.exports = function (fastify, opts, next) {
    fastify.post('/test/:what', async function (req, res, next) {
        console.log(req.body)
        let result = await flowExe(req.body, req.params.what);
        return result;
    });
    fastify.post('/fetch-info/', async function (req, res, next) {
        let result = await fetchInfo(req.body);
        return result;
    });


    next()
}