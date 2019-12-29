const upath = require("upath")
const Project = require(upath.join(__app.lib, "project"));
module.exports = function (fastify, opts, next) {
    fastify.get('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").getState());
    });
    fastify.post('/', async function (req, res, next) {
        await Project.create(req.body);
        let newProj = __app.configManager.getDb("projects").set(req.body.projectName, req.body).write();
        return newProj;
    });
    fastify.put('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").set(req.body.projectName, req.body).write());
    });
    fastify.delete('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("projects").unset(req.query.projectName).write());
    });
    next()
}