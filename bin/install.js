#!/bin/env node

const path = require("path");
const yargs = require("yargs");
const delay = require("delay");

var argv = yargs
  .usage("Usage: $0 -e dev")
  .option("env", {
    alias: "e",
    describe: "env code [dev|qa|prod]",
    type: "string",
    demand: true
  })
  .argv;


const main = require(path.resolve(__dirname, "..", "lib/main"));


main.init(argv).then(async function () {
  await __app.couchDb.createDbIfNotExists("databases");
  await __app.couchDb.createDbIfNotExists("projects");
  await __app.couchDb.createDbIfNotExists("datasets");
  await __app.couchDb.createDbIfNotExists("sqls");
  await __app.couchDb.createDbIfNotExists("config");
  await __app.couchDb.createDbIfNotExists("errors");
  await __app.couchDb.createDbIfNotExists("jobs");
  await __app.couchDb.createDbIfNotExists("interfaces");

}).catch(function (err) {
  __app.logger.error("flow exec failed:", err.stack);
  process.exit(-1)
});
