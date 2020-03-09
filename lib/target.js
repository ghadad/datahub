const delay = require('delay');

const internals = {}
exports = module.exports = class Terget {
  constructor(params) {

  }

  async save(db, data, opts) {
    db = __app.lodash.toString(db);
    let self = this;
    if(!data._id) throw new __app.error("Missing doc id !",{code:"MISID"});
    await __app.couchDb.upsert(db, data).then(res => __app.logger.debug("db:",db,"data:",data,"res:",res)).catch(e=>console.log("err:",e.stack));
    return data;
  }
}