module.exports = function (fastify, opts, next) {
    fastify.get('/', function (req, res, next) {
        return res.send(__app.configManager.getDb("databases").getState());
    });
    next()
}