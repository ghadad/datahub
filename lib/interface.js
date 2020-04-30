const internals = {}
const delay = require('delay');
const Interface = require("./interface");
const Collector = require("./collector");
const Target = require("./target");
const Mapper = require("./mapper");
const Stat = require("./stat");
const Finalize = require("./finalize");
const Producer = require("./producer");
const Postman = require("./postman");

const hl = require("highland");

exports = module.exports = class Interface {
  constructor(config) {
    this.runId = __app.ts();
    this.config = config;
    this.interfaceConfig = {};
    this.dbs = {};
    this.target = null;
    this.collector = null;
    this.rows = [];
    this.interfaceFinalData = {};
    __app.local.dbs.forEach(db => this.dbs[db._id] = db.db)
    __app.logger.debug("dbs:", this.dbs);
    this.startTime = __app.ts("seconds");
    this.interfaceError = null;

  }

  async init() {
    this.interfaceConfig = await __app.couchDb.get("interfaces", __app.args.interface);
    if (this.interfaceConfig.handler)
      this.collectorPostHandler = rfs('module.exports = ' + this.interfaceConfig.handler);
    this.interfaceConfig.target = {
      targetEntity: "interface_" + __app.args.interface
    }

    await __app.couchDb.createDbIfNotExists(this.interfaceConfig.target.targetEntity);

    this.target = new Target(this.interfaceConfig.target);
    this.mapper = new Mapper(this.interfaceConfig.properties.props);
    this.finalize = new Finalize(this.interfaceConfig, this.mapper);

    this.statProps = this.mapper.getStatProps();
    this.stat = new Stat(this.mapper.getStatProps());
    this.producer = new Producer(this.interfaceConfig.output);
    this.postman = new Postman(this.interfaceConfig);

    /*  this.interfaceConfig.source.collectorPostHandler =
     this.interfaceConfig.source.collectorPostHandler || function (data) {
         return data;
      }; */
    this.collector = new Collector(this.interfaceConfig.source);

    for (let db of this.getDbsConfig()) {
      await __app.dal.init(db.dbAlias, db.config);
    }
  }


  getDbsConfig() {
    let dbs = {};

    if (this.interfaceConfig.source.dbAlias) {
      let db = this.dbs[this.interfaceConfig.source.dbAlias];
      if (!db)
        throw new Error(`flow dbAlias config ${flowDbAlias} not found in databases config`);
      dbs[this.interfaceConfig.source.dbAlias] = db;
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
        message: err.message,
        code: err.code
      };
      doc._id = self.interfaceConfig.target.targetEntity + ":" + doc._id;
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
    if (!data._id) {
      __app.logger.error("no _id found!,check your data/log files")
      return;
    }

    data._id = this.interfaceConfig.target.targetEntity + ":" + data._id;
    __app.couchDb.upsert("errors", data).then(res => console.log(res)).catch(e => console.error(e));
  }

  setError(data, stage = "noStage", err) {
    data.$error = {
      stage: stage,
      message: err.message
    };
    return data;
  }



  async cleanup() {

    return true;
  }

  async getInterfaceRowsResult() {
    let self = this;
    if (this.interfaceError) {
      return []
    }

    let stream = await __app.couchDb.getStream(this.interfaceConfig.target.targetEntity);
    return new Promise(function (resolve, reject) {
      hl(stream).map(function (data) {
          let newData = {};
          Object.assign(newData, data.tempData.new || {}, {
            $prev: data.tempData.old || {},
            $delta: data.delta || {},
            $runId: data.tempData.runId
          })
          return newData;
        }).filter(function (data) {
          return (self.runId == data.$runId);
        })
        .filter(function (data) {
          if (self.interfaceConfig.resultType == 'all')
            return true;
          else if (self.interfaceConfig.resultType == 'changes')
            return data.$delta.change;
          else
          if (self.interfaceConfig.resultType == 'new')
            return data.$delta.newAdded;
          else
          if (self.interfaceConfig.resultType == 'deleted')
            return data.$delta.deleted;
          return false;
        })
        .stopOnError(e => reject("Failed on stream result "))
        .toArray(function (xs) {
          resolve(xs);
        })
    })
  }


  getfinalInterfaceResult() {
    if (this.interfaceError)
      return {
        rows: [],
        failure: true,
        ok: false,
        type: "failure",
        error: this.interfaceError.stack,
        created: __app.ts("pretty"),
        yyyymmdd: __app.ts("pretty")
      };

    return {
      rows: this.rows,
      stat: this.stat.get(),
      success: true,
      type: "success",
      summary: {
        runId: this.runId,
        created: __app.ts("pretty"),
        yyyymmdd: __app.ts("pretty"),
        totalRows: this.rows.length
      }
    }
  }

  async exec() {
    let self = this;
    await self.init();
    //await __app.dal.init(__app.config.databases[self.collector.getConfig().dbAlias])
    await this.validate();
    let flowStatus;
    try {
      flowStatus = await self.collector.collect(this.runFlow(self), this.runFlowBulkUpsert(self), 15, 500);
      self.stat.calc();
      this.rows = await this.getInterfaceRowsResult();
    } catch (e) {
      this.interfaceError = e;
      __app.logger.error(e.message, e.stack);
    }
    __app.logger.info("Collect Interface data ended ! ", this.interfaceError ? "With ERROR" : "Successfuly");
    this.interfaceFinalData = this.getfinalInterfaceResult();
    __app.logger.info("Build Interface products , interface runId  : ", this.runId);
    await this.producer.produce(this.interfaceFinalData);
    console.log("this.interfaceFinalData:", this.interfaceFinalData)

    await self.postman.send(this.interfaceFinalData);
  }


  getKey(data) {
    __app.logger.debug("this.collector.getKey(data):", this.collector.getKey(data))
    return __app.lodash.toString(this.collector.getKey(data));
  }

  async getExists(db, id) {
    __app.logger.debug("getExists:", db, id)
    return await __app.couchDb.get(db, id);
  }


  validate() {
    let self = this;

  }

  setRowObject(newData = {}, oldInterfaceEntry = {}) {
    let prevData = __app.lodash.get(oldInterfaceEntry, 'tempData.new', {});
    let oldCreated = __app.lodash.get(oldInterfaceEntry, 'tempData.newCreated', __app.ts());
    let oldRunId = __app.lodash.get(oldInterfaceEntry, 'tempData.runId', 0);

    let rowObject = {
      tempData: {
        runId: this.runId,
        oldRunId: oldRunId,
        newCreated: __app.ts(),
        oldCreated: oldCreated,
        old: {},
        new: {}
      }
    };

    rowObject.tempData.new = newData;
    rowObject.tempData.old = prevData;
    rowObject._id = newData._id || oldInterfaceEntry._id;;
    if (oldInterfaceEntry._rev)
      rowObject._rev = oldInterfaceEntry._rev;
    return rowObject;
  }

  runFlow(self) {
    return async function (data, returnObjectOnStage = false) {
      let newData, mappedData;
      newData = data;

      if (self.collectorPostHandler) {
        try {
          newData = await self.collectorPostHandler(data);
        } catch (e) {
          return self.saveError(data, "collector", e, returnObjectOnStage);
        }


        if (returnObjectOnStage == "collectorHandler")
          return self.setRowObject(newData);
      }

      try {
        newData._id = self.getKey(newData);
      } catch (e) {
        return self.saveError(newData, "getKey", e, returnObjectOnStage);
      }

      if (returnObjectOnStage == "getKey")
        return self.setRowObject(newData);


      let oldDataEntry = {};
      try {
        oldDataEntry = await self.getExists(self.interfaceConfig.target.targetEntity, newData._id);
      } catch (e) {
        //return self.saveError(newData, "getKey", e, returnObjectOnStage);
      }
      if (returnObjectOnStage == "getExists")
        return self.setRowObject(newData, oldDataEntry);

      try {
        mappedData = await self.mapper.map(newData);
      } catch (e) {
        if (e.code == "DROP") {
          __app.logger.warn("mapping:", e.message, "code:", e.code)
          return self.setRowObject(self.setError(newData, "mapping", e), oldDataEntry);

        }
        return self.saveError(newData, "mapping", e, returnObjectOnStage);
      }
      Object.assign(newData, mappedData);
      self.stat.add(newData);
      if (returnObjectOnStage == "mapping")
        return self.setRowObject(newData, oldDataEntry);

      let finalRowObject
      try {
        finalRowObject = await self.finalize.finalizeInterfaceRow(self.setRowObject(newData, oldDataEntry), data);
      } catch (e) {
        return self.saveError(finalRowObject, "finalize", e, returnObjectOnStage);
      }


      // on tester mode return fullfilled object

      return finalRowObject;

    }
  }

  runFlowBulkUpsert(self) {
    return async function (data) {

      let bulkData;
      let newBulk = data.filter(doc => {
        if (doc.$error && doc.$error.code == 'FATALROW') {
          __app.logger.error(`fatal row detected `, doc)
          return false;
        }
        return true;
      })

      try {
        bulkData = await self.target.saveBulk(self.interfaceConfig.target.targetEntity, newBulk, {
          force: true,
          new_edits: false
        })
      } catch (e) {
        __app.logger.error("runFlowBulkUpsert Error:", e)
        data = self.saveErrorBulk(newBulk, "saveTarget", e);
      }
      return bulkData;
    }
  }
}