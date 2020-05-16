const JSONStream = require("JSONStream"),
  es = require('event-stream');

const nano = require('nano')
const CouchdbDAL = class {
  constructor(config) {
    this.config = config
    this.nano = null;
  }

  connect(url) {
    this.nano = nano(url);
    return this.nano;
  }

  getConnection() {
    return this.nano;
  }

  async createDb(db) {
    const dbref = this.nano.db.create(db);
    return {
      success: true
    };
  }

  async createDbIfNotExists(db) {
    let dbref = this.nano.db.use(db);
    try {
      await dbref.info()
    } catch (e) {
      dbref = await this.nano.db.create(db);
    }

    return {
      success: true
    };
  }

  async renameId(db, sourceId, rev, destId, options = {}) {
    let docdb = this.nano.db.use(db);
    let opts = {
      overwrite: false
    };
    try {
      let res = await docdb.copy(sourceId, destId, Object.assign(opts, options));
      await this.delete(db, sourceId, rev);
      return res;
    } catch (e) {
      throw new Error(`Falied to copy  ${db} -> ${sourceId} ->  ${destId} , reason :  ${e.message}`)
    }
  }

  async get(db, id) {

    let docdb = this.nano.db.use(db);
    try {
      let res = await docdb.get(id);
      return res;
    } catch (e) {
      throw new Error(`Falied to get ${db} -> ${id} , reason :  ${e.message}`)
    }
  }


  async fetch(db, ids) {

    let docdb = this.nano.db.use(db);

    try {
      let res = await docdb.fetch({
        keys: ids
      });
      return res;
    } catch (e) {
      throw new Error(`Falied to fetch ${db} -> reason :  ${e.message}`)
    }
  }
  async getAll(db) {
    let docdb = this.nano.db.use(db);
    let res = await docdb.list({
      include_docs: true
    });
    return res.rows.map(d => d.doc);
  }

  getStream(db) {
    let docdb = this.nano.db.use(db);
    return docdb.listAsStream({
        include_docs: true
      })
      .pipe(JSONStream.parse('rows.*'))
      .pipe(es.mapSync(function (data) {
        return data.doc
      }));
  }

  async isExists(db, id) {
    let docdb = this.nano.db.use(db);
    let res = await docdb.head(id);
    return res;
  }

  async delete(db, id, rev) {

    const dbref = this.nano.db.use(db);

    let res = await dbref.destroy(id, rev);
    return res;
  }

  async create(db, doc) {
    const dbref = this.nano.db.use(db);
    let res = await dbref.insert(doc);
    return res;
  }

  async createIndex(db, name, fields) {
    const dbref = this.nano.db.use(db);
    const indexDef = {
      index: {
        fields: fields
      },
      name: name
    };
    return await dbref.createIndex(indexDef);
  }

  // mango query
  async find(db, query) {
    const dbref = this.nano.db.use(db);
    return await dbref.find(query);
  }

  findAsStream(db, query = {}) {
    const dbref = this.nano.db.use(db);
    return dbref.findAsStream(query)
      .pipe(JSONStream.parse('docs.*'))
  }

  async update(db, doc) {
    const dbref = this.nano.db.use(db);
    let res = await dbref.insert(doc);
    return res;
  }

  async compact(db) {
    const dbref = this.nano.db.use(db);
    let res = await dbref.compact();
    return res;
  }



  async updateBulk(db, data) {

    const dbref = this.nano.db.use(db);
    return await dbref.bulk({
      docs: data
    })
  }

  async upsert(db, doc, options = {}) {
    if (options.checkExist) {
      if (doc._id) {
        let existsDoc = await this.get(db, doc._id).catch(e => e);

        if (existsDoc._rev) {
          doc._rev = existsDoc._rev;
          doc.updated = __app.ts();
        } else {
          doc.created = __app.ts();
        }
      }
    }
    let res = await this.update(db, doc);
    return res;

  }

  async upsertBulk(db, data, options = {}) {
    if (options.checkExist) {
      for (let doc of data) {
        if (doc._id) {
          let existsDoc = await this.get(db, doc._id).catch(e => console.log(e));

          if (existsDoc._rev) {
            doc._rev = existsDoc._rev;
            doc.updated = __app.ts();
          } else {
            doc.created = __app.ts();
          }
        }
      }
    }


    return await this.updateBulk(db, data, options);

  }


}

module.exports = CouchdbDAL;