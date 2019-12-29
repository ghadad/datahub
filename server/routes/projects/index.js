const glob = require("glob-promise")
const upath = require("upath")
module.exports = function (fastify, opts, next) {
    fastify.get('/', async function (req, res, next) {
        return await glob(upath.join(__app.projectsPath + "/**proj.json"));
    });
    fastify.post('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").set(req.body.dbAlias, req.body.db).write());
    });
    fastify.put('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").set(req.body.dbAlias, req.body.db).write());
    });
    fastify.delete('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").unset(req.query.dbAlias).write());
    });
    next()
}