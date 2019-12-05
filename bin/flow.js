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
        .option("project", {
          alias: "p",
          describe: "project name",
          type: "string",
          demand: true
        })
        .option("flow", {
          alias: "f",
          describe: "flow  name",
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
  const Project = __app.require(__app.lib,"project");
  const Flow = __app.require(__app.lib,"flow");
  let project = new Project({path:"/home/webdev/datahub/examples/customer"})
  let flowConfig = project.getFlow(argv.flow);
  let flow = new Flow(flowConfig);
  await  flow.collect();
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(-1)
});
