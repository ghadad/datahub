#!nnode

const upath = require("upath");
const yargs = require("yargs");
const delay = require("delay");
var CronJob = require('cron').CronJob;
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

  const JobClass = require(upath.join(__dirname, "..", "lib/job"));

  for (let jobData of await JobClass.getHubJobs()) {
    var job = new CronJob(JobClass.cronString(jobData), function () {
      JobClass.execFlow(jobData)
    }, null, true);
    job.start();
  }

  for (let jobData of await JobClass.getInterfacesJobs()) {
    var job = new CronJob(JobClass.cronString(jobData), function () {
      JobClass.execInterface(jobData)
    }, null, true);
    job.start();
  }

}).catch(err => {
  __app.logger.error("jobManager failed:", err.stack);
  process.exit(-1)
});