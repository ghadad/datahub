#!nnode

const upath = require("upath");
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


const main = require(upath.join(__dirname, "..", "lib/main"));


main.init(argv).then(async () => {
  const Project = __app.require(__app.lib, "project");
  const Flow = __app.require(__app.lib, "flow");
  let project = new Project({
    name: argv.project
  });
  await project.get()
  let flowConfig = project.getFlow(argv.flow);
  let flow = new Flow(flowConfig);
  await flow.init();
  let t1 = __app.ts();
  __app.logger.info("flow start")
  let rows =await flow.exec();
  await flow.cleanup();
  let t2 = __app.ts();
  __app.logger.info(`flow end and took ${t2-t1} MS`)
  process.exit(0)
}).catch(err => {
  __app.logger.error("flow exec failed:", err.stack);
  process.exit(-1)
});