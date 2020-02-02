const delay = require('delay');

const internals = {}
exports = module.exports = class Terget {
  constructor(params) {

  }

  async save(db, data, opts) {
    let self = this;
    __app.logger.info("target start");
    await __app.couchDb.create(db, data).then(res => console.log(res)).catch(err => console.log(err))
    __app.logger.info("target end");
    return data;
  }
}