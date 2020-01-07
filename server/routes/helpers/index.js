const upath = require("upath")
const Transformer = require(upath.join(__app.lib, "transformer"));
const Validator = require(upath.join(__app.lib, "validator"));

module.exports = function (fastify, opts, next) {

    fastify.get('/functions', function (req, res, next) {
        return res.send({
            transforms:Transformer.getFunctions(),
            validations:Validator.getFunctions()
        });
    });
   
    next()
}