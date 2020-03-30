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
  .option("log-level", {
    alias: "l",
    demand: false,
    describe: "log level",
    type: "string"
  }).argv;


const main = require(upath.join(__dirname, "..", "lib/main"));


main.init(argv).then(async () => {
  const Job = __app.require(__app.lib, "job");
  Job.runJob(["ddd", "dsd", "dsds"])
  process.exit(0)
}).catch(err => {
  __app.logger.error("job  exec failed:", err.stack);
  process.exit(-1)
});