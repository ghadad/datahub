module.exports = function (fastify, opts, next) {

    fastify.get('/:id', async function (req, res, next) {
        let doc = await __app.couchDb.get("datasets", req.params.id);
        return res.send(doc);
    });

    fastify.get('/', async function (req, res, next) {
        // await __app.couchDb.createDb("databases");
        let allDocs = await __app.couchDb.getAll("datasets");
        return res.send(allDocs);
    });

    fastify.post('/test', async function (req, res, next) {
        let knex = __app.dal.connect(req.body.db);
        let usersTable = await knex.raw("select 1 from dual");
        return res.send({
            success: true,
            usersTable: usersTable
        });
    });

    fastify.post('/', async function (req, res, next) {
        let isExists = await __app.couchDb.isExists("datasets", req.body.id);
        return res.send(isExists);
        let insStatus = await __app.couchDb.create("datasets", req.body);
        return res.send(insStatus);
    });
    fastify.put('/', async function (req, res, next) {
        let updateStatus = await __app.couchDb.create("datasets", req.body);
        return res.send(updateStatus);
    });
    fastify.delete('/', async function (req, res, next) {
        return res.send(await __app.couchDb.delete("datasets", req.query.id, req.query.rev));
    });
    next()
}