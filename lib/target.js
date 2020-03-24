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
      await __app.couchDb.upsertBulk(db, data, options);
    } catch (e) {
      console.log(e)
    }


    // aggreagte pathces and insert them to revisions collection
    if (self.flowConfig.revisionsCollection) {
      let existsDocsByKey = {};

      let historyDocs = data.filter(d => d.$control.change && d.$control.patch).map(d => {
        return { 
          entityId:d._id,
          $control:d.$control ,
          rvisionCreated:__app.ts() 
        } 
      });
     // let existsDocs = await __app.couchDb.fetch(this.flowConfig.revisionsCollection, ids, options).catch(e => console.log(e));

     // existsDocs.rows.forEach(d => existsDocsByKey[d.key] = d.doc);

      //let patches = data.filter(d => d.$control.change && d.$control.patch).map(d => {
      //  let existVersionsDoc = existsDocsByKey[d._id] || {
      //    versions: []
      //  };

       // existVersionsDoc.versions.push(d.$control);
       // return {
       //   entityId: d._id,
         // _rev: existVersionsDoc._rev,
     //    $control : 
     //     versions: existVersionsDoc.versions
     //   };
     // });

      await __app.couchDb.upsertBulk(this.flowConfig.revisionsCollection, historyDocs, options)
    }
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