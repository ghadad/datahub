const internals = {}
let CsvReader = require("./csv");
exports = module.exports = class {
  constructor(config) {
      this.config = config;
      __app.logger.info("collector config:",this.config)
      this.type = "csv";
      this.csvReader =  new CsvReader(this.config);
  }
  getKey(data){
      return this.csvReader.getKey(data) ;
  }
  async collect(flow){
      await this.csvReader.collect(flow);    
  }
  async query() {
  }
}