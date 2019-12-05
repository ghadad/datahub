#!/usr/bin/env node

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
        .option("log-level", {
          alias: "l",
          demand: false,
          describe: "log level",
          type: "string"
        }).argv;


console.log("options:",argv,argv);
const main = require(path.resolve(__dirname, "..", "lib/main"));


main.init(argv).then(async () => {
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(-1)
});
