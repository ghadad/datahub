const internals = {}
const shelljs = require("shelljs")
exports = module.exports = class {
  constructor(params) {

  }

  static async getAllJobsTable() {
    let projects = await __app.couchDb.getAll("projects");
    let table = [];
    for (let p of projects) {
      for (let i = 0; i < p.jobs.length; i++) {
        if (p.jobs[i].method == "crontab" && p.jobs[i].flows.length) {
          table.push({
            project: p._id,
            jobKey: p._id + "_" + i,
            description: p.jobs[i].description,
            scheduling: p.jobs[i].scheduling,
            flows: p.jobs[i].flows
          })
        }
      }
    }
    return table;
  }

  static exec(jobData) {
    try {
      __app.logger.info(`start job :${jobData.description} - should be registred in jobs table`)
      for (let flow of jobData.flows) {
        let cmd = `node ${__app.bin}/flow.js -p ${jobData.project} -f ${flow} -e ${__app.args.env}`;
        __app.logger.info(`start cmd: ${cmd}`)

        if (shelljs.exec(`node ${__app.bin}/flow.js -p ${jobData.project} -f ${flow} -e ${__app.args.env}`).code !== 0) {
          // shelljs.exit(1);
          throw new __app.error("job failed for flow :" + flow)
        }
      }
    } catch (e) {
      __app.logger.error(`job : ${jobData.description} has failed `, e.message)
      __app.logger.error(`event to be registered in jobs table`)
    }
    return true;
  }
}