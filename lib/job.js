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
            jobKey: p._id + "_" + i,
            description: p.description,
            scheduling: p.jobs[i].scheduling,
            flows: p.jobs[i].flows
          })
        }
      }
    }
    return table;
  }

  static runJob(flows) {
    for (let flow of flows) {
      if (shelljs.exec("node " + __app.bin + "/flow.js -p dddd -f dddd -e " + __app.args.env).code !== 0) {
        shelljs.exit(1);
        throw new __app.error("job failed for flow :" + flow)
      }
    }
  }
}