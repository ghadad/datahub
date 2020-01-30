const upath = require("upath")
const sj = require("serialize-javascript");
const Project = require(upath.join(__app.lib, "project"));



module.exports = function (fastify, opts, next) {

    fastify.get('/:id', async function (req, res, next) {
        let doc = await __app.couchDb.get("projects", req.params.id);
        return res.send(doc);
    });

    fastify.get('/template/flow', function (req, res, next) {
        return res.send(Project.getFlowTemplateTree());
    });

    fastify.get('/', async function (req, res, next) {
        // await __app.couchDb.createDb("databases");
        let allDocs = await __app.couchDb.getAll("projects");
        return res.send(allDocs);
    });

    fastify.post('/', async function (req, res, next) {

        let isExists = await __app.couchDb.isExists("projects", req.body._id).catch(e => e);
        if (isExists.statusCode == 200)
            return res.status(420, "doc exists").send({
                ok: false,
                message: "doc already exists"
            });

        let projectTemplate = {}

        if (req.body.generated)
            projectTemplate = Project.getTemplateTree();

        let insStatus = await __app.couchDb.create("projects", Object.assign(req.body, projectTemplate));

        return res.send(insStatus);
    });

    fastify.put('/', async function (req, res, next) {

        let updateStatus = await __app.couchDb.create("projects", req.body);
        return res.send(updateStatus);
    });

    fastify.delete('/', async function (req, res, next) {
        return res.send(await __app.couchDb.delete("projects", req.query.id, req.query.rev));
    });

    next()
}


module.exports2 = function (fastify, opts, next) {

    fastify.get('/:project', async function (req, res, next) {
        let project = new Project({
            name: req.params.project,
            path: upath.join(__app.config.projectsPath, req.params.project)
        });
        return sj(project.getObject());
    });

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