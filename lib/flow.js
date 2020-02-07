const internals = {}
const delay = require('delay');
const Collector = require("./collector");
const Mapper = require("./mapper");
const Discover = require("./discover");
const Target = require("./target");
const rfs = require("require-from-string");

exports = module.exports = class Flow {
  constructor(config) {
    this.config = config;
    this.collector = new Collector(this.config.collector.config);
    this.collectorPostHandler = rfs('module.exports = ' + this.config.collector.handler);
    this.config.mapping.handler = rfs('module.exports = ' + this.config.mapping.handler)
    this.config.discover.handler = rfs('module.exports = ' + this.config.discover.handler)

    __app.logger.info("flow collector:", this.config.collector);
    this.mapper = new Mapper(this.config.mapping.config);
    this.discover = new Discover(this.mapper);
    this.target = new Target();
    this.dbs = __app.configManager.getDb("databases").getState();
    this.handlers = {};
  }

  getDbsConfig() {
    let dbs = {};
    let flowDbAlias = this.collector.getConfig().dbAlias;
    if (flowDbAlias) {
      let db = this.dbs[flowDbAlias];
      if (!db)
        throw new Error(`flow dbAlias config ${flowDbAlias} not found in databases config`);
      dbs[flowDbAlias] = db;
    }
    for (let mapDbAlias of this.mapper.getInvolvedDbAliases()) {
      let db = this.dbs[mapDbAlias];
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
  //  await __app.couchDb.createDb(this.collector.config.targetEntity);
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
      let newData = await self.collectorPostHandler(data);
      newData._id = self.getKey(newData);

      newData = await self.mapper.map(newData);
      newData = await self.config.mapping.handler(newData);
      newData = await self.discover.discover(newData);
      newData = await self.config.discover.handler(newData);
      newData = await self.target.save(self.collector.config.targetEntity, newData, {
        force: true
      }) //.catch(error => console.log(error));

      return newData;
    }
  }
}