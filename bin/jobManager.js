#!nnode

const upath = require("upath");
const yargs = require("yargs");
const delay = require("delay");
var CronJob = require('cron').CronJob;
const JobClass = require(upath.join(__dirname, "..", "lib/job"));
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

let jobs;

main.init(argv).then(async () => {

  console.log(await JobClass.getAllJobsTable())
  var job = new CronJob('*/14 * * * * *', function () {
    console.log('You will see this message every second');
  }, null, true, 'America/Los_Angeles');
  job.start();
}).catch(err => {
  __app.logger.error("jobManager failed:", err.stack);
  process.exit(-1)
});