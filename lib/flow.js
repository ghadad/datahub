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
    this.flowConfig = config.config;
    this.collector = new Collector(this.config.collector.config);
    this.collectorPostHandler = rfs('module.exports = ' + this.config.collector.handler);

    this.config.mapping.handler = rfs('module.exports = ' + this.config.mapping.handler)
    this.config.discover.handler = rfs('module.exports = ' + this.config.discover.handler)

    this.mapper = new Mapper(this.config.mapping.config);
    this.discover = new Discover(this.mapper);
    this.target = new Target();
    this.dbs = {};
    __app.local.dbs.forEach(db => this.dbs[db._id] = db.db)
    __app.logger.info("dbs:", this.dbs)
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

  saveError(data) {
    data._id = this.flowConfig.targetEntity + ":" + data._id;
    __app.couchDb.upsert("errors", data).then(res => console.log(res)).catch(e => console.error(e));
  }

  async init() {
    await __app.couchDb.createDbIfNotExists(this.flowConfig.targetEntity);
    for (let db of this.getDbsConfig()) {
      await __app.dal.init(db.dbAlias, db.config);
    }
  }

  async exec() {

    let self = this;
    await self.init();
    //await __app.dal.init(__app.config.databases[self.collector.getConfig().dbAlias])
    await this.validate();
    await self.collector.collect(this.runFlow(self));
    __app.logger.info("Flow end here")
  }

  getKey(data) {
    return __app.lodash.toString(this.collector.getKey(data));
  }


  validate() {
    let self = this;

    if (!self.flowConfig.targetEntity) {
      throw new Error("Missing target Entity value")
    }
  }

  runFlow(self) {
    return async function (data) {
      let newData, mappedData;
      try {
        newData = await self.collectorPostHandler(data);
      } catch (e) {
        __app.logger.error("collector:", e.message)
        newData.$error = {
          stage: "collector",
          message: e.message
        };
        return self.saveError(newData);
      }

      try {
        newData._id = self.getKey(newData);
      } catch (e) {
        __app.logger.error("getKey:", e.message)
        newData.$error = {
          stage: "getKey",
          message: e.message
        };
        return self.saveError(newData);
      }

      try {
        mappedData = await self.mapper.map(newData);
      } catch (e) {
        if (e.code == "DROP") {
          __app.logger.warn("mapper.map:", e.message, "code:", e.code)
          return;
        }

        __app.logger.error("mapper.map:", e.message, "code:", e.code)

        newData.$error = {
          stage: "mapping",
          message: e.message
        };
        return self.saveError(newData);
      }

      try {
        mappedData = await self.config.mapping.handler(mappedData, data, data);
      } catch (e) {
        __app.logger.error("mapping.handler:", e.message, e.code)
        mappedData.$error = {
          stage: "mappingHandler",
          message: e.message
        };
        return self.saveError(newData);
      }

      try {
        mappedData = await self.discover.discover(mappedData);
      } catch (e) {
        __app.logger.error("discover.discover:", e.message)
        mappedData.$error = {
          stage: "discover",
          message: e.message
        };
        return self.saveError(mappedData);
      }

      try {
        mappedData = await self.config.discover.handler(mappedData);
      } catch (e) {
        __app.logger.error("discover.handler:", e.message)
        newData.$error = {
          stage: "discoverHandler",
          message: e.message
        };
        return self.saveError(mappedData);
      }

      try {
        mappedData = await self.target.save(self.flowConfig.targetEntity, mappedData, {
          force: true
        })
      } catch (e) {
        __app.logger.error("target.save:", e.message)
        newData.$error = {
          stage: "saveTarget",
          message: e.message
        };
        return self.saveError(mappedData);
      }
      return mappedData;
    }
  }
}