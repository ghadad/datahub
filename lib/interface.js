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
    this.deletedCollector = null;
    this.rows = [];
    this.errors = [];
    this.interfaceFinalData = {};
    this.errorCollection = "interface_errors";
    __app.local.dbs.forEach(db => this.dbs[db._id] = db.db)
    __app.logger.debug("dbs:", this.dbs);
    this.startTime = __app.ts("seconds");
    this.interfaceError = null;

  }

  async init() {

    this.interfaceConfig = await __app.couchDb.get("interfaces", __app.args.interface);
    this.interfaceConfig.target = {
      targetEntity: "interface_" + __app.args.interface
    }

    if (this.interfaceConfig.handler)
      this.collectorPostHandler = rfs('module.exports = ' + this.interfaceConfig.handler);


    let existsRun = await __app.sysDb.get("interface_jobs", this.interfaceConfig.target.targetEntity);
    this.lastSeqNo = __app.lodash.get(existsRun, 'seqNo', 0);
    this.seqNo = existsRun.success ? this.lastSeqNo + 1 : this.lastSeqNo;
    this.existsRev = __app.lodash.get(existsRun, '_rev') ? {
      _rev: existsRun._rev
    } : {};
    this.lastRunId = __app.lodash.get(existsRun, 'runId', 0);
    this.lastSuccess = __app.lodash.get(existsRun, 'success', false);
    this.lastSuccessRunId = this.lastSuccess ? this.lastRunId : 0;
    this.jobObject = {
      ...this.existsRev,
      _id: this.interfaceConfig.target.targetEntity,
      runId: this.runId,
      seqNo: this.seqNo,
      lastRunId: this.lastRunId,
      created: __app.ts(),
      state: "start",
      success: false
    };
    await __app.sysDb.upsert("interface_jobs", this.jobObject, {
      checkExist: true
    });

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

    let initialFilter = {
      "selector": {
        "runId": {
          "$ne": this.runId,
          "$gte": this.lastSuccessRunId
        }
      }

    };
    this.deletedCollector = new Collector({
      sourceType: "systemDB",
      sourceEntity: this.interfaceConfig.target.targetEntity,
      runId: this.runId,
      initialFilter: initialFilter
    });

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
    });

    if (returnError)
      return data;

    __app.couchDb.upsertBulk(this.errorCollection, data).then(res => __app.logger.debug(res)).catch(e => console.error(e));
  }



  async saveError(data, stage = "noStage", err, returnError = false) {
    __app.logger.error("Flow error on stage:", stage, err.message, err.code ? "code:" + err.code : "", err.stack)
    Object.assign(data, {
      runId: this.runId,
      entityId: this.interfaceConfig.target.targetEntity,
      $error: {
        stage: stage,
        message: err.message
      }
    });

    if (returnError)
      return data;
    delete data._id;
    await __app.couchDb.upsert(this.errorCollection, data).catch(function (e) {
      throw new __app.error("Critical error !" + e.message, {
        fatal: true
      })
    });
    return data;

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

  getInterfaceRowsResult() {
    let self = this;
    if (this.interfaceError) {
      return []
    }
    let q = {
      "selector": {
        "runId": self.runId
      }
    }



    return new Promise(function (resolve, reject) {
      let stream = __app.couchDb.findAsStream(self.interfaceConfig.target.targetEntity, q);
      hl(stream).map(function (data) {
          let newData = {};
          Object.assign(newData, data.tempData.new || {}, {
            $prev: data.tempData.old || {},
            $delta: data.delta || {},
            $runId: data.tempData.runId
          })
          return newData;
        }).map(function (data) {
          return data;
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
          if (self.interfaceConfig.resultType == 'delete') {
            return data.$delta.deleted;
          }
          return false;
        })
        .stopOnError(e => reject(`Failed on stream getInterfaceRowsResult :${e.stack}`))
        .toArray(function (xs) {
          console.log(xs)
          resolve(xs);
        })
    })
  }



  async getInterfaceErrors() {
    let self = this;
    if (self.interfaceError) {
      return []
    }
    let q = {
      "selector": {
        entityId: self.interfaceConfig.target.targetEntity,
        "runId": self.runId
      }
    }

    return new Promise(function (resolve, reject) {
      let stream = __app.couchDb.findAsStream(self.errorCollection, q)

      hl(stream).map(function (data) {
          data.error = data.$error.message;
          delete data._rev;
          delete data.$control;
          delete data.$error;
          return data;
        }).stopOnError(e => reject(`Failed on stream getInterfaceErrors :${e.stack}`))
        .toArray(function (xs) {
          resolve(xs);
        })
    })
  }



  getfinalInterfaceResult(type) {

    let summary = {
      interface: this.interfaceConfig,
      runId: this.runId,
      created: __app.ts("pretty"),
      yyyymmdd: __app.ts("pretty"),
      timestamp: __app.ts("timestamp"),
      splitValue: "xxx",
      seqNo: this.seqNo,
      interfaceName: this.interfaceConfig.interfaceName,
      description: this.interfaceConfig.description


    }

    if (type == "failure" && this.interfaceError)
      return {
        ...summary,
        type: "failure",
        error: this.interfaceError
      };

    if (type == "errors" && this.errors.length)
      return {
        ...summary,
        errors: this.errors,
        type: "errors",
      };

    if (type == "success")
      return {
        ...summary,
        rows: this.rows,
        stat: this.stat.get(),
        type: "success",
        totalRows: this.rows.length,
      }

    return summary;
  }


  async exec() {
    let self = this;
    await self.init();
    await this.validate();
    let flowStatus, deleteFlowStatus;
    try {
      flowStatus = await self.collector.collect(this.runFlow(self), this.runFlowBulkUpsert(self), 15, 500);
      __app.logger.info("start update deleted entries");
      deleteFlowStatus = await self.deletedCollector.collect(self.updateDeletedFlow(self), self.runFlowBulkUpsert(self), 15, 500);

      self.stat.calc();
      self.rows = await self.getInterfaceRowsResult();
      self.errors = await self.getInterfaceErrors();

    } catch (e) {

      if (__app.lodash.isString(e)) {
        self.interfaceError = e;
      } else {
        self.interfaceError = e.stack;
      }
      __app.logger.info("Collect Interface data ended ! ", this.interfaceError);

    }

    __app.logger.info("Build Interface products , interface runId  : ", this.runId);

    if (self.postman.isActive("success") && !self.interfaceError) {
      self.successData = self.getfinalInterfaceResult("success");
      await self.producer.produce(self.successData);
      await self.postman.send(self.successData);
    }

    if (self.postman.isActive("failure") && self.interfaceError) {
      self.failureData = this.getfinalInterfaceResult("failure");
      await self.postman.send(self.failureData);
    }

    if (this.postman.isActive("errors") && !self.interfaceError) {
      this.errorsData = self.getfinalInterfaceResult("errors");
      await self.postman.send(self.errorsData);
    }
    await __app.sysDb.upsert("interface_jobs", {
      ...self.jobObject,
      success: true,
      state: "end"
    }, {
      checkExist: true
    });
  }

  async updateDeleted() {
    /*
    .map(function (data) {
      let deleted = __app.lodash.get(data.delta, 'deleted', null);
      return deleted != true;
    }).map(function (data) {
      if (data.runId != self.runId) {
        __app.lodash.set(data, 'delta.deleted', true);
        data.runId = self.runId;
      }*/
  }

  getKey(data) {
    let keyValue = this.collector.getKey(data);
    if (keyValue == undefined || keyValue == null) {
      __app.logger.error("key config :", this.interfaceConfig.source.keyType, this.interfaceConfig.source[this.interfaceConfig.source.keyType])
      throw new __app.error("Cannot get key value")
    }
    return keyValue;
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
    let oldRunId = __app.lodash.get(oldInterfaceEntry, 'runId', 0);

    let rowObject = {
      runId: this.runId,
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


  updateDeletedFlow(conf) {
    return async function (data) {
      data.runId = conf.runId;
      __app.lodash.set(data, 'delta.deleted', true);
      return data;
      let deleted = __app.lodash.get(data, 'delta.deleted', false);
      if (deleted || data.runId == conf.runId) {
        data.$skip = true;
        return data;
      }
      if (data.runId != conf.runId) {
        __app.lodash.set(data, 'delta.deleted', true);
        data.runId = conf.runId;
      }
      return data;
    }
  }

  runFlow(self) {
    return async function (data, returnObjectOnStage = false) {
      let newData, mappedData;
      newData = data;

      if (self.collectorPostHandler) {
        try {
          newData = await self.collectorPostHandler(data);
        } catch (e) {
          return await self.saveError(data, "collector", e, returnObjectOnStage);
        }


        if (returnObjectOnStage == "collectorHandler")
          return self.setRowObject(newData);
      }

      try {
        newData._id = self.getKey(newData);
      } catch (e) {
        return await self.saveError(newData, "getKey", e, returnObjectOnStage);
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
        return await self.saveError(newData, "mapping", e, returnObjectOnStage);
      }
      Object.assign(newData, mappedData);
      self.stat.add(newData);
      if (returnObjectOnStage == "mapping")
        return self.setRowObject(newData, oldDataEntry);

      let finalRowObject
      try {
        finalRowObject = await self.finalize.finalizeInterfaceRow(self.setRowObject(newData, oldDataEntry), data);
      } catch (e) {
        return await self.saveError(finalRowObject, "finalize", e, returnObjectOnStage);
      }


      // on tester mode return fullfilled object
      //  console.log("finalRowObject", finalRowObject)
      finalRowObject._id = __app.lodash.toString(finalRowObject._id)
      return finalRowObject;

    }
  }

  runFlowBulkUpsert(self) {
    return async function (data) {
      let bulkData;
      let newBulk = data.filter(doc => {
        if (doc.$error) {
          __app.logger.error(`error row detected `, doc)
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