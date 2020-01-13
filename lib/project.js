const find = require("find");
const _ = require("lodash");
const path = require("path");
const upate = require("upath");
const util = require("util");
const internals = {}
const json5 = require('json5')
const fs = require('fs-extra')
const upath = require("upath");

exports = module.exports = class Project {
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

  static async create(config) {
    if (!config.projectName)
      throw new Error("missing project name ")
    let destination = upate.join(__app.config.projectsPath, config.projectName);
    if (await fs.pathExists(destination))
      throw new Error(`project ${config.projectName} already exists`)

    let newProjDir = await fs.copy(upate.join(__app.templatePath, "project"), destination);
    return {
      path: __app.config.projectsPath,
      status: newProjDir
    }
  }

  static getTemplateTree() {
    let doc = {};
    let templatePath = upath.normalize(upath.join(__app.templatePath, "project"));
    let files = find.fileSync(/\.js$|\.json$/, templatePath);
    for (let f of files) {

      let objectPath = upath.normalize(f).replace(templatePath, '').replace(/[\/\\]/g, ".").replace(/^\./, "").replace(/\.js$|\.json$/, "");
      console.log("file:", f, objectPath)
      if (f.match(/\.json$/)) {
        _.set(doc, objectPath, json5.parse(fs.readFileSync(f)));
      } else if (f.match(/\.js$/)) {
        _.set(doc, objectPath, require(f));
      } else
        throw new Error("cannot load project .support only js ot json files");
    }
    return doc;
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
  getFlow(flow = null) {
    if (flow == null)
      throw new Error("Missing flow parameter")
    let retFlow = __app.lodash.get(this.tree, 'flows[' + flow + ']');
    if (!retFlow) throw new Error(`flow:${flow} not found in project config`);
    return retFlow;
  }

}