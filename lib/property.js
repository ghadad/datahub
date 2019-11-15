const internals = {}
exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.type = params.type;
    this.fetchExp="";
    this.fetchType = "";
    this.mapping = "";
    this.filter = "";
    this.created= "";
    this.updated = null;
    this.version  = params.version;
  }
}