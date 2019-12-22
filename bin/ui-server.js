#!/usr/bin/env node

const os = require("os");
const path = require("path");
const yargs = require("yargs");
const fastify = require("fastify")({
  logger: true, ignoreTrailingSlash: true
});

const getPort = require('get-port');
fastify.register(require("fastify-routes"));



let publicRoot = path.resolve(__dirname, "..", 'ui/dist');
console.log("publicRoot:", publicRoot)
fastify.register(require('fastify-static'), {
  root: publicRoot,
  wildcard: "**",
  //prefix: '/public/', // optional: default '/'
})
fastify.get('/admin', function (req, reply) {
  reply.sendFile('admin.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})
fastify.get('/hub', function (req, reply) {
  reply.sendFile('hub.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})
fastify.get('/interface', function (req, reply) {
  reply.sendFile('interface.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})



var argv = yargs
        .usage("Usage: $0 -e dev")
        .option("env", {
          alias: "e",
          describe: "env code [dev|qa|prod]",
          type: "string",
          demand: true
        })
        .option("log-level", {
          alias: "l",
          demand: false,
          describe: "log level",
          type: "string"
        }).argv;

const main = require(path.resolve(__dirname, "..", "lib/main"));

argv.appType = "ui";
let appRoutes = [];

fastify.setErrorHandler(function (error, request, reply) {
  __app.logger.error(error)
  var statusCode = error.statusCode >= 400 ? error.statusCode : 500
  reply
          .code(statusCode)
          //.type('text/plain')
          .send({error: statusCode >= 500 ? 'Internal server error' + error.message : error.message,info:error})
})

main.init(argv)
        .then(async () => {
          __app.utils.applyRoutes("api", __app.routesPath, fastify);

          const start = async () => {
            fastify.ready(err => {
              if (err)
                throw err;
            });

            let minPort = __app.config.server.port || 3000;
            let freePort = await getPort({port: getPort.makeRange(minPort, minPort + 1000)})

            try {
              await fastify.listen(
                      freePort, "0.0.0.0"
                      //, process.env.CONTAINER_HOST || __app.config.server.host
                      );
              __app.logger.info(`Server available on ${__app.config.server.url}:${freePort}  on localhost : http://localhost:${freePort}`)
              appRoutes = [...fastify.routes];
            } catch (err) {
              fastify.log.error(err);
              process.exit(1);
            }
          };
          start();
        })
        .catch(err => console.error(err));