
module.exports = function (fastify, opts, next) {
    
    fastify.get('/:id', async function (req, res, next) {
        let doc = await __app.couchDb.get("databases", req.params.id);
        return res.send(doc);
    });

    fastify.get('/', async function (req, res, next) {
        // await __app.couchDb.createDb("databases");
        let allDocs = await __app.couchDb.getAll("databases");
        return res.send(allDocs);
    });

    fastify.post('/test', async function (req, res, next) {
        let knex = __app.dal.connect(req.body.db);
        let usersTable = await knex.raw("select 1 from dual") ;
        return res.send({success:true,usersTable:usersTable}); 
    });

    fastify.post('/', async function (req, res, next) {
        let isExists = await __app.couchDb.isExists("databases", req.body.id);
        return res.send(isExists);
        let insStatus = await __app.couchDb.create("databases", req.body);
        return res.send(insStatus);
    });
    fastify.put('/', async function (req, res, next) {
        let updateStatus = await __app.couchDb.create("databases", req.body);
        return res.send(updateStatus);
    });
    fastify.delete('/', async function (req, res, next) {
        return res.send(await __app.couchDb.delete("databases", req.query.id, req.query.rev));
    });
    next()
}