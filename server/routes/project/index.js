module.exports = function (fastify, opts, next) {
  fastify.get('/user', function () {
    return {
      status: true
    }
  });
  fastify.get('/healthcheck', async function () {
    return await __app.dal.getOne("select 'OK' test_db from dual");
  })

  fastify.get('/hello', function (req, res, next) {
    res.send({
      hello: "fastify"
    })
  })
  fastify.get('/error', async function (request, reply) {
    let err = new Error("dsdsds");
    err.statusCode = 400;
    err.message = "ddsdsdsdsdsdsdsd";
    throw err;
  })
  next()
}
