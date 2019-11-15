const internals = {}
exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.query="";
    this.key = params.key;
    this.version  = params.version;
  }
}