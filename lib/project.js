const find = require("find");
const _ = require("lodash");
const path = require("path");
const util = require("util");
const internals = {}
const json5 = require('json5')


exports = module.exports = class Project  {
  constructor(params) {
    this.name = params.name;
    this.path = params.path;
    this.tree = {};
    if (this.path) {
      this.baseDir = path.basename(this.path);
      this.dotBaseDir = this.path.replace(/\.js$|\.json$/, "").replace(/[\/\\]/g, ".").replace(/^\.+/, "");
      __app.logger.info(this.path, this.baseDir, this.dotBaseDir)
      this.readFromFile();
    }
  }

  readFromFile() {
    let self = this;
    __app.logger.info("self.path:", self.path)
    let files = find.fileSync(/\.js$|\.json$/, self.path);
    for (let f of files) {
      let dotFilePath = f.replace(/\.js$|\.json$/, "").replace(/[\/\\]/g, ".").replace(/^\.+/, "");
      let objectPath = dotFilePath.replace(self.dotBaseDir, "").replace(/^\.+/, "");
      if (f.match(/\.json$/)) {
        _.set(self.tree, objectPath, json5.parse(fs.readFileSync(f)));
      } else if (f.match(/\.js$/)) {
        _.set(self.tree, objectPath, require(f));
      } else
        throw new Error("cannot load project .support only js ot json files");
    }
    return self;
  }
  getObject() { 
    return this.tree;
  }
  getFlows() {
    return this.tree.flows;
  }
  getFlow(flow=null) { 
    if(flow==null)
      throw new Error("Missing flow parameter")
    let retFlow = __app.lodash.get(this.tree,'flows['+flow+']') ;
    if(!retFlow) throw new Error(`flow:${flow} not found in project config`) ;
    return retFlow;
  }
  
}