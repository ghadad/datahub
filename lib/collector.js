const internals = {}
let CsvReader = require("./csv");
const queryReader = require("./query")
exports = module.exports = class {
  constructor(params) {
      this.config = params.config;
      __app.logger.info("collector config:",this.config)
      this.type = this.config.sourceType;
      switch(this.type){
          case "csv": this.reader =  new CsvReader(this.config);break;
          case "sql": this.reader =  new queryReader(this.config);break;
         default :throw new Error(`cannot get reader by  sourceType=${this.type}`)
      }
      
  }
  getKey(data){
      return this.reader.getKey(data) ;
  }
  async collect(flow){
      await this.reader.collect(flow);    
  }
  async query() {
  }
}