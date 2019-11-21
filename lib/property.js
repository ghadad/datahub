const internals = {}
exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.key = params.key;
    this.value = null;
    this.type = params.type;
    this.fetchExp="";
    this.fetchType = "";
    this.mapping = "";
    this.filter = "";
    this.created= "";
    this.updated = null;
    this.version  = params.version;
  }

  async map(data) {
    let mapper = new  __app.mapper(data,this.rule);
      this.value = await mapper.process();
  }
}