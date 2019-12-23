#!nnode

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


main.init(argv).then(async () => {

  __app.logger.info("Config:", __app.configManager.getDb("databases").getState())
  // set k=>v 
  __app.configManager.getDb("databases").set("maria2", {
    client: "mysql"
  }).write();

  // remove k 
  __app.configManager.getDb("databases").unset("maria2").write();
  //get key
  __app.logger.info("db get :", __app.configManager.getDb("databases").get("maria1").value())

}).catch(err => {
  __app.logger.error("flow exec failed:", err.stack);
  process.exit(-1)
});