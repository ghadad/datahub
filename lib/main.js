const upath = require("upath");
const path = require("path");

const _ = require("lodash");
const moment = require("moment");
const json5 = require("json5");
const Joi = require("joi");
const os = require("os");
const pino = require('pino');
const pinoLogger = pino({
  useLevelLabels: true,
  customLevels: {
    blinfo: 25,
    perf: 25
  },
  prettyPrint: {
    colorize: false,
    translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
    ignore: 'pid,hostname'
  }
})
const sj =

  global.__base = path.resolve(path.dirname(__filename), "..");

global.__app = {
  require: function (a, b) {
    return require(path.resolve(a, b))
  },
  _: _,
  lodash: _,
  base: __base,
  path: path,
  bin: path.resolve(__base, "bin"),
  lib: path.resolve(__base, "lib"),
  examples: path.resolve(__base, "examples"),
  confDir: path.resolve(__base, "config"),
  moment: moment,
  json: json5,
  config: {},
  shortid :require("shortid")
};

__app.sj = require("serialize-javascript");

const Config = require(path.resolve(__app.lib, "config"));
const CouchDb = require(path.resolve(__app.lib, "dal/couchdb"));
const utils = require(path.resolve(__app.lib, "utils"));

__app.hash = utils.md5;

__app.local = {
  lastEcho: new Date().getTime(),
};

global.Joi = Joi;
__app.logger = pinoLogger;
__app.error = require(path.resolve(__app.lib, "error"));
const Dal = require(path.resolve(__app.lib, "dal"));
__app.dal = new Dal({});
__app.routesPath = path.resolve(__app.base, "server", "routes");
__app.templatePath = path.resolve(__app.base, "templates");

__app.validator = require(path.resolve(__app.lib, "validator"));

__app.date = require(path.resolve(__app.lib, "date"));
__app.cache = {};
__app.ts = utils.ts;
__app.utils = utils;
if (process.env.DATAHUB_ENV) {
  Object.assign(__app.config, new Config().getConfig(), {
    loaded: true
  });
}

async function bootstrap(args) {
  __app.args = args;
  __app.logger.info("server  start with:", args)
  let envConfig = new Config(args.env);

  __app.configManager = envConfig;
  Object.assign(__app.config, envConfig.getConfig(), {
    loaded: true
  });


  __app.client = require(path.resolve(__app.lib, "client"));
  __app.logger.level = __app.args.l || __app.config.logLevel || "info";
  __app.couchDb = CouchDb;
  __app.couchDb.connect(__app.config.couchDbUrl);
  __app.local.dbs = await __app.couchDb.getAll("databases");
  return true;
}

module.exports.init = async args => {
  return await bootstrap(args).catch(e => {
    __app.logger.error("main.bootstrap ended with fatal failure see error description :")
    console.error(e)
    process.exit(-1);
  });
};

__app.exit = function () {
  process.exit(exitStatus);
};
module.exports.app = __app;