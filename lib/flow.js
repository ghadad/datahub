const internals = {}
const delay = require('delay');
const Collector = require("./collector");
const Mapper = require("./mapper");
const Discover = require("./discover");
const Target = require("./target");

exports = module.exports = class Flow {
  constructor(config) {
    this.config = config;
    this.collector = new Collector(this.config.collector.config);
    __app.logger.info("flow collector:", this.config.collector);
    this.mapper = new Mapper(this.config.mapping.config);
    this.discover = new Discover(this.mapper);
    this.target = new Target();
  }

  getDbsConfig() {
    let dbs = {};
    let flowDbAlias = this.collector.getConfig().dbAlias;
    if (flowDbAlias) {
      let db = __app.config.databases[flowDbAlias];
      if (!db)
        throw new Error(`flow dbAlias config ${flowDbAlias} not found in databases config`);
      dbs[flowDbAlias] = db;
    }
    for (let mapDbAlias of this.mapper.getInvolvedDbAliases()) {
      let db = __app.config.databases[mapDbAlias];
      if (!db)
        throw new Error(`mapping rule DbAlias config ${mapDbAlias} not found in databases config`);
      dbs[mapDbAlias] = db;
    }

    return Object.keys(dbs).map(d => {
      return {
        dbAlias: d,
        config: dbs[d]
      }
    });
  }

  async init() {
    for (let db of this.getDbsConfig()) {
      await __app.dal.init(db);
    }
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
      newData = await self.discover.discover(newData);
      newData = await self.config.discover.handler(newData);
      newData._id = self.config.collector.config.targetEntity + "/" + self.getKey(newData);
      newData = await self.target.save(newData, {
        force: true
      }) //.catch(error => console.log(error));
      console.log("newData:", newData)
      return newData;
    }
  }
}