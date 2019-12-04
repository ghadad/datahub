const internals = {}
exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.query="";
    this.key = params.key;
    this.version  = params.version;
    this.properties =params.properties;
    this.activeRecord={}
    this.extendRecord={}
  }
  async query() {
    let stream =  await __app.dal.query(this.query,{LAST_RUN_DATE:params.LAST_RUN_DATE},{stream:true});
    stream.on("data",function(data){});
    stream.on("end",function(data){});
    stream.on("error",function(error){});
  }

  async map() {
    for(let propConfig of this.properties){
      let property = new __app.property(propConfig);
      property.map(this.activeRecord);
      this.extendRecord[property.key] = property.value;
    }
  }
}