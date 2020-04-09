module.exports = function (fastify, opts, next) {

    fastify.get('/:db', async function (req, res, next) {
        let doc = await __app.couchDb.getAll(req.params.db);
        return res.send(doc);
    });


    fastify.get('/:db/:id', async function (req, res, next) {
        let doc = await __app.couchDb.get(req.params.db, req.params.id);
        return res.send(doc);
    });

    fastify.post('/:db', async function (req, res, next) {
        let doc = await __app.couchDb.upsert(req.params.db, req.body);
        return res.send(doc);
    });

    fastify.put('/:db', async function (req, res, next) {
        if (!(req.body._id && req.body._rev))
            throw new Error("Cannot update " + req.params.db + " Missing I or rev params")
        let doc = await __app.couchDb.upsert(req.params.db, req.body);
        return res.send(doc);
    });

    fastify.post('/rename', async function (req, res, next) {
        let doc = await __app.couchDb.renameId(req.body.db, req.body.id, req.body.rev, req.body.targetId);
        return res.send(doc);
    });

    fastify.delete('/:db/:id/:rev', async function (req, res, next) {
        let doc = await __app.couchDb.delete(req.params.db, req.params.id, req.params.rev);
        return res.send(doc);
    });

    next()
}