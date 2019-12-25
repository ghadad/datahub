module.exports = function (fastify, opts, next) {
    fastify.get('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("databases").getState());
    });
    fastify.post('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("databases").set(req.body.dbAlias, req.body.db).write());
    });
    fastify.put('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("databases").set(req.body.dbAlias, req.body.db).write());
    });
    fastify.delete('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("databases").unset(req.query.dbAlias).write());
    });
    next()
}