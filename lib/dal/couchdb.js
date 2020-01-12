const nano = require('nano')
const CouchdbDAL = class  {
  constructor(config){
    this.config = config
    this.nano = null;
  }
  connect (url){
    this.nano = nano(url);
    return this.nano ;
  }
  getConnection(){
    return this.nano;
  }

  async createDb(db){
    const dbref = this.nano.db.create(db) ;
    return {success:true};
  }

  
  async getAll(db){
    let docdb = this.nano.db.use(db) ;
    let res = await docdb.list({include_docs: true});
    return res.rows.map(d=>d.doc);
  }
  
  async isExists(db,id){
    let docdb = this.nano.db.use(db) ;
    let res = await docdb.head(id);
    return res;
  }

  async delete(db,id,rev){
    
    const dbref = this.nano.db.use(db) ;
    
    let res = await dbref.destroy(id,rev);
    return res;
  }

  async create(db,doc){
    const dbref = this.nano.db.use(db) ;
    let res = await dbref.insert(doc);
    return res;
  }

  async update(db,doc){
    const dbref = this.nano.db.use(db) ;
    let res = await dbref.insert(doc);
    return res;
  }

}

module.exports = new CouchdbDAL();

