const delay = require('delay');

const internals = {}
exports = module.exports = class Terget {
  constructor(params) {

  }

  async save(db, data, opts) {
    db = __app.lodash.toString(db);
    let self = this;
    await __app.couchDb.upsert(db, data).then(res => console.log);
    return data;
  }
}