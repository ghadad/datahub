const find = require("find");
const _ = require("lodash");
const path = require("path");
const util = require("util");
const internals = {}

exports = module.exports = class {
  constructor(params) {
    this.name = params.name;
    this.path = params.path; 
    this.tree = {};
    if(this.path) { 
      this.baseDir =  path.basename(this.path);
      this.dotBaseDir  =  this.path.replace(/\.js$/,"").replace(/[\/\\]/g,".").replace(/^\./,"");
      this.readFromFile();
    }
  }

  readFromFile() { 
    let self = this;
    find.file(/\.js$/, this.path, function(files) {
      for(let f of  files) { 
        let dotFilePath = f.replace(/\.js$/,"").replace(/[\/\\]/g,".").replace(/^\./,"");
        let objectPath =dotFilePath.replace(self.dotBaseDir,"").replace(/^\./,"");
        console.log("objectPath:",objectPath,f)
        _.set(self.tree,objectPath,require(f));
        
      }
    })
    
    console.log(util.inspect(this.tree,false, null));
  }  

}