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
  .option("interface", {
    alias: "i",
    describe: "interface name",
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
  const Interface = __app.require(__app.lib, "interface");
  const Flow = __app.require(__app.lib, "flow");
  let interface = new Interface({
    name: argv.interface
  });

  __app.logger.info("interface start")
  let rows = await interface.exec();
  await interface.cleanup();
  process.exit(0)
}).catch(err => {
  __app.logger.error("flow exec failed:", err.stack);
  process.exit(-1)
});