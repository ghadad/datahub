module.exports = function (fastify, opts, next) {
    fastify.get('/', function (req, res, next) {
        res.send({
            success: true
        });
    });
    next()
}