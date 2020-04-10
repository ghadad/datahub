const upath = require("upath");
const rfs = require("require-from-string");
const Query = require(upath.join(__app.lib, "query"));

const fetchInfo = async function (data) {
    let q = new Query(data)
    return await q.fetchInfo();
}

module.exports = function (fastify, opts, next) {
    fastify.post('/fetch-info/', async function (req, res, next) {
        let result = await fetchInfo(req.body);
        return result;
    });


    next()
}