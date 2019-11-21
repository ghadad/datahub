const internals = {}
exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.dbEngine = params.dbEngine;
    this.connectionConfig  = params.connectionConfig;
  }
}