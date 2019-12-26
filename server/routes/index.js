module.exports = function (fastify, opts, next) {
    fastify.get('/', function (req, res, next) {
        res.send({
            success: true
        });
    });
    fastify.get('/config', function (req, res, next) {
        res.send(__app.config);
    });
    next()
}