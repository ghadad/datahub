const upath = require("upath");
const axios = require("axios");
const fs = require("fs");

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

    fastify.get('/templates', function (req, res, next) {

        return res.send(__app.json.parse(fs.readFileSync(__app.public + "/templates/gallery.json")));
    });

    fastify.post('/fetch-info/', async function (req, res, next) {
        let result = await fetchInfo(req.body);
        return result;
    });


    next()
}