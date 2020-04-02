const internals = {}
const shelljs = require("shelljs")
const Project = __app.require(__app.lib, "project");

exports = module.exports = class {
  constructor(params) {

  }

  static async getAllJobsTable() {
    let projects = await __app.couchDb.getAll("projects");
    let table = [];
    for (let p of projects) {

      for (let i = 0; i < p.jobs.length; i++) {
        if (p.jobs[i].method == "crontab") {

          table.push({
            project: p._id,
            jobKey: p._id + "_" + i,
            description: p.jobs[i].description,
            scheduling: p.jobs[i].scheduling,
            flows: p.jobs[i].flows || []
          })
        }
      }
    }
    return table;
  }

  static cronString(jobData) {
    let cronarr = [
      jobData.scheduling.seconds,
      jobData.scheduling.minutes || "*",
      jobData.scheduling.hours || "*",
      jobData.scheduling.dayOfMonth || "*",
      jobData.scheduling.months || "*",
      jobData.scheduling.dayOfWeeks || "*"
    ];
    return cronarr.join(" ");
  }
  static async exec(jobData) {

    let project = new Project({
      name: jobData.project
    });
    await project.get();

    if (!project.isActive()) {
      __app.logger.warn(`project :${jobData.project} is inactive !`)
      return true;
    }

    let activeFlows = [];
    for (let flow of jobData.flows) {
      if (project.isFlowActive(flow))
        activeFlows.push(flow)
    }
    __app.logger.info(`start job :${jobData.description} - should be registred in jobs table`)
    let jobEvent = await __app.couchDb.create("jobs", {
      ...jobData,
      created: __app.ts(),
      pretty_created: __app.ts("pretty"),
    });
    if (jobData.flows.length == 0) {
      __app.logger.warn(`no active flow found in job flows list`)
      return true;
    }

    try {


      for (let flow of activeFlows) {

        let cmd = `node ${__app.bin}/flow.js -p ${jobData.project} -f ${flow} -e ${__app.args.env}`;
        __app.logger.info(`start cmd: ${cmd}`)

        if (shelljs.exec(`node ${__app.bin}/flow.js -p ${jobData.project} -f ${flow} -e ${__app.args.env}`).code !== 0) {
          // shelljs.exit(1);
          throw new __app.error("job failed for flow :" + flow)
        }
      }
    } catch (e) {
      __app.couchDb.update("jobs", {
        ...jobData,
        _id: jobEvent.id,
        _rev: jobEvent.rev,
        status: "FAILED",
        updated: __app.ts(),
        pretty_updated: __app.ts("pretty"),
        messsage: "job failed for flow :" + flow

      })
      __app.logger.error(`job : ${jobData.description} has failed `, e.message)
      __app.logger.error(`event to be registered in jobs table`)
    }
    __app.couchDb.update("jobs", {
      ...jobData,
      _id: jobEvent.id,
      _rev: jobEvent.rev,
      status: "OK",
      updated: __app.ts(),
      pretty_updated: __app.ts("pretty"),
      messsage: "job finish successfully"
    })

    return true;
  }
}