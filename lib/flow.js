const internals = {}
const Collector = require("./collector");
exports = module.exports = class Flow {
  constructor(config) {
      this.config = config;
      __app.logger.info("flow collector:",this.config.collector);
  }
  async collect() {
    let collector = new Collector(this.config.collector);
    await collector.collect();
    }
  }
