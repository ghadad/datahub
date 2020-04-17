const delay = require('delay');

const internals = {}
exports = module.exports = class Terget {
  constructor(flowConfig) {
    this.flowConfig = flowConfig;
  }

  async save(db, data, opts) {
    db = __app.lodash.toString(db);
    let self = this;

    await __app.couchDb.upsert(db, data).then(res => __app.logger.debug("db:", db, "data:", data, "res:", res)).catch(e => console.log("err:", e.stack));
    return data;
  }

  async saveBulk(db, data, options = {}) {
    db = __app.lodash.toString(db);
    let self = this;
    for (let doc of data) {
      if (!doc._id) throw new __app.error("Missing doc id !", {
        code: "MISID"
      });
    }
    try {
      let res = await __app.couchDb.upsertBulk(db, data, options);
      console.log(res);
    } catch (e) {
      console.log(e)
    }

    /* On error you will get the folowing : 
    [
       {
          "id" : "FishStew",
          "error" : "conflict",
          "reason" : "Document update conflict."
       },
       {
          "id" : "LambStew",
          "error" : "conflict",
          "reason" : "Document update conflict."
       },
       {
          "id" : "BeefStew",
          "error" : "conflict",
          "reason" : "Document update conflict."
       }
    ]
    */
    // aggreagte pathces and insert them to revisions collection
    if (self.flowConfig.revisionsCollection) {
      let existsDocsByKey = {};

      let historyDocs = data.filter(d => d.$control.change && d.$control.patch).map(d => {
        return {
          entityId: d._id,
          $control: d.$control,
          rvisionCreated: __app.ts()
        }
      });
      await __app.couchDb.upsertBulk(this.flowConfig.revisionsCollection, historyDocs, options)
    }
    return data;
  }

  async saveErrorBulk(db, data, opts) {
    db = __app.lodash.toString(db);

    await __app.couchDb.upsertBulk(db, data).then(res => __app.logger.debug("db:", db, "data:", data, "res:", res)).catch(e => console.log("err:", e.stack));
    return data;
  }

}