const internals = {}
const delay = require('delay');
const Collector = require("./collector");
const Mapper = require("./mapper");
const Inspector = require("./inspector");
const Target = require("./target");

exports = module.exports = class Flow {
  constructor(config) {
    this.config = config;
    this.collector = new Collector(this.config.collector.config);
    __app.logger.info("flow collector:", this.config.collector);
    this.mapper = new Mapper(this.config.mapping.config);
    this.inspector = new Inspector(this.config.inspector.config);
    this.target = new Target();
  }

  async init() {
    console.log(__app.config.databases[this.collector.getConfig().dbAlias])
  }
  async exec() {
    let self = this;
    await self.init();
    //await __app.dal.init(__app.config.databases[self.collector.getConfig().dbAlias])
    await self.collector.collect(this.runFlow(self))
  }

  getKey(data) {
    return this.collector.getKey(data);
  }

  runFlow(self) {
    return async function (data) {
      let newData = await self.config.collector.handler(data);
      newData = await self.mapper.map(newData);
      newData = await self.config.mapping.handler(newData);
      newData = await self.inspector.inspect(newData);
      newData = await self.config.inspector.handler(newData);
      newData._id = self.config.collector.config.targetEntity + "/" + self.getKey(newData);
      newData = await self.target.save(newData, {
        force: true
      }) //.catch(error => console.log(error));
      console.log("newData:", newData)
      return newData;
    }
  }
}