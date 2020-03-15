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

  saveErrorBulk(data, stage = "noStage", err, returnError = false) {
    let self = this;
    __app.logger.error("Flow error on stage:", stage, err.message, err.code ? "code:" + err.code : "", err.stack)
    data = data.map(function (doc) {
      doc.$error = {
        stage: stage,
        message: err.message
      };
      doc._id = self.flowConfig.targetEntity + ":" + doc._id;
    });

    if (returnError)
      return data;

    __app.couchDb.upsertBulk("errors", data).then(res => __app.logger.debug(res)).catch(e => console.error(e));
  }


  saveError(data, stage = "noStage", err, returnError = false) {
    __app.logger.error("Flow error on stage:", stage, err.message, err.code ? "code:" + err.code : "", err.stack)
    data.$error = {
      stage: stage,
      message: err.message
    };
    if (returnError)
      return data;

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
    await self.collector.collect(this.runFlow(self), this.runFlowBulkUpsert(self), 13, 100);
    __app.logger.info("Flow end here")
  }

  getKey(data) {
    __app.logger.debug("this.collector.getKey(data):", this.collector.getKey(data))
    return __app.lodash.toString(this.collector.getKey(data));
  }

  async  getExists(db,id) {
    __app.logger.debug("getExists:", db,id)
    return await  __app.couchDb.get(db,id);
  }


  validate() {
    let self = this;

    if (!self.flowConfig.targetEntity) {
      throw new Error("Missing target Entity value")
    }
  }

  runFlow(self) {
    return async function (data, returnObjectOnStage = false) {

      let newData, mappedData;
      try {
        newData = await self.collectorPostHandler(data);
      } catch (e) {
        return self.saveError(data, "collector", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "collectorHandler")
        return newData;

      try {
        newData._id = self.getKey(newData);
      } catch (e) {
        return self.saveError(newData, "getKey", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "getKey")
        return newData;

      let existsData = {};
        try {
          existsData = await self.getExists(self.flowConfig.targetEntity,newData._id);
        } catch (e) {
          //return self.saveError(newData, "getKey", e, returnObjectOnStage);
        }
        
        if (returnObjectOnStage == "getExists")
          return newData;

      try {
        mappedData = await self.mapper.map(newData);
      } catch (e) {
        if (e.code == "DROP") {
          __app.logger.warn("mapping:", e.message, "code:", e.code)
          return;
        }
        return self.saveError(newData, "mapping", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "mapping")
        return mappedData;


      try {
        mappedData = await self.config.mapping.handler(mappedData, data, existsData);
      } catch (e) {
        return self.saveError(mappedData, "mappingHandler", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "mappingHandler")
        return mappedData;

      try {
        mappedData = await self.discover.discover(mappedData,existsData,data);
      } catch (e) {
        return self.saveError(mappedData, "discover", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "discover")
        return mappedData;

      try {
        mappedData = await self.config.discover.handler(mappedData,existsData,data);
      } catch (e) {
        return self.saveError(mappedData, "discoverHandler", e, returnObjectOnStage);

      }


      if (returnObjectOnStage == "discoverHandler")
        return mappedData;

      // on tester mode return fullfilled object

      return mappedData;

    }
  }

  runFlowBulkUpsert(self) {
    return async function (data) {
      let bulkData;
      try {
        bulkData = await self.target.saveBulk(self.flowConfig.targetEntity, data, {
          force: true
        })
      } catch (e) {
        data = self.saveErrorBulk(data, "saveTarget", e);
      }

      return data;
    }
  }
}