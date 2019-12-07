const internals = {}
const delay = require('delay');

const Collector = require("./collector");
const Mapper = require("./mapper");
const Inspector = require("./inspector");
const Target = require("./target");
exports = module.exports = class Flow {
  constructor(config) {
    this.config = config;
    __app.logger.info("flow collector:", this.config.collector);
    this.mapper =  new Mapper(this.config.mapping.config);
    this.inspector =  new Inspector(this.config.inspector.config);
    this.target = new Target();
  }
  async collect() {
    let self = this;
    let collector = new Collector(this.config.collector);
    await collector.collect(this.runFlow(self));
  }

  runFlow(self) {
    return async function (data) {
        let newData = await self.config.collector.handler(data);
        newData = await self.mapper.map(newData);
        newData = await self.config.mapping.handler(newData);
        newData = await self.inspector.inspect(newData);
        newData = await self.config.inspector.handler(newData);
        newData = await self.target.save(newData)//.catch(error => console.log(error));
        console.log("newData:",newData)
        return newData;
    }
  }
}