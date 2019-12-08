const delay = require('delay');
const PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-upsert'));

const internals = {}
exports = module.exports = class Terget {
  constructor(params) {
    this.db = new PouchDB("mydb");
  }

  async save(data,opts) {
    let self = this;
      __app.logger.info("target start");
      await self.db.upsert(data._id,function(data){
        //here you put some logic of new md5 etc
        // if you want to avoid update return false; 
        return  data;
        
      }).then(res=>console.log(res)).catch(err=>console.log(err))
      __app.logger.info("target end");
    return data;
  }
}