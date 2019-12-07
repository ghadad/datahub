const delay = require('delay');
const PouchDB = require("pouchdb");
const internals = {}
exports = module.exports = class Terget {
  constructor(params) {
    this.db = new PouchDB("mydb");
  }

  async save(data) {
    let self = this;
      __app.logger.info("target start");
      await self.db.put(data).then(res=>console.log(res)).catch(err=>console.log(err))
      __app.logger.info("target end");
    return data;
  }
}