const internals = {}
let CsvReader = require("./csv");
exports = module.exports = class {
  constructor(config) {
      this.config = config;
      __app.logger.info("collector config:",this.config)
      this.type = "csv";
  }

  async collect(flow){
      let csvReader =  new CsvReader(this.config)
      await csvReader.collect(flow);    
  }
  async query() {
  }

}