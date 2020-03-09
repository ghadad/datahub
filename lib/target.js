const delay = require('delay');

const internals = {}
exports = module.exports = class Terget {
  constructor(params) {

  }

  async save(db, data, opts) {
    db = __app.lodash.toString(db);
    let self = this;

    await __app.couchDb.upsert(db, data).then(res => __app.logger.debug("db:", db, "data:", data, "res:", res)).catch(e => console.log("err:", e.stack));
    return data;
  }

  async saveBulk(db, data, opts) {


    db = __app.lodash.toString(db);

    let self = this;

    for (let doc of data) {
      if (!doc._id) throw new __app.error("Missing doc id !", {
        code: "MISID"
      });
    }
    await __app.couchDb.upsertBulk(db, data)
      .then(res => __app.logger.debug("db:", db, "data:", data, "res:", res))
      .catch(e => console.log("saveBulk err:", e.stack));
    return data;
  }

  async saveErrorBulk(db, data, opts) {
    db = __app.lodash.toString(db);
    let self = this;
    for (doc of data) {
      if (!doc._id) throw new __app.error("Missing doc id !", {
        code: "MISID"
      });
    }
    await __app.couchDb.upsertBulk(db, data).then(res => __app.logger.debug("db:", db, "data:", data, "res:", res)).catch(e => console.log("err:", e.stack));
    return data;
  }

}