const upath = require("upath");
const rfs = require("require-from-string");
const Query = require(upath.join(__app.lib, "query"));
const SystebDbCollector = require(upath.join(__app.lib, "systemdb"));
const fetchInfo = async function (data) {
    if (data.sourceType == 'query') {
        let q = new Query(data)
        return await q.fetchInfo();
    }
    if (data.sourceType == 'systemDB') {
        let q = new SystebDbCollector(data)
        let fields = await q.fetchInfo();
        return fields.filter(f => !(f.startsWith('$') || f.startsWith('_rev')))
    }
    return []
}

module.exports = function (fastify, opts, next) {
    fastify.post('/fetch-info/', async function (req, res, next) {
        let result = await fetchInfo(req.body);
        return result;
    });


    next()
}