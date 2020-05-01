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
  await __app.couchDb.createDbIfNotExists("hub_errors");
  await __app.couchDb.createDbIfNotExists("jobs");
  await __app.couchDb.createDbIfNotExists("interfaces");
  await __app.couchDb.createDbIfNotExists("interface_errors");


  //create config doc per env


  await __app.couchDb.createDbIfNotExists("config", {
    _id: "dev"
  });
  await __app.couchDb.createDbIfNotExists("config", {
    _id: "qa"
  });
  await __app.couchDb.createDbIfNotExists("config", {
    _id: "prod"
  });

  await __app.couchDb.createIndex("hub_errors", "hub_error_idx", ["entityId"]);
  await __app.couchDb.createIndex("interface_errors", "interface_error_idx", ["entityId", "runId"]);


}).catch(function (err) {
  __app.logger.error("install failed:", err.stack);
  process.exit(-1)
});