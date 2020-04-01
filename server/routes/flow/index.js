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

    let FlowObject = new Flow(flow);
    await FlowObject.init();

    let runFlowHandler = FlowObject.runFlow(FlowObject);

    let collector = new Collector(flow.collector.config);

    let result = await collector.test(5);

    if (step == "collector")
        return result;

    let testResult = [];
    for (let row of result) {
        let stepRowResult = await runFlowHandler(row, step);
        if (stepRowResult.$error) {
            let error = stepRowResult.$error;
            delete stepRowResult.$error;
            testResult.push({
                $error: error,
                ...stepRowResult
            })
        } else {
            testResult.push(stepRowResult)
        }

    }
    return testResult;

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