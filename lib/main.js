const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const json5 = require("json5");
const Joi = require("joi");
const os = require("os");
const pino = require('pino');
const pinoLogger = pino({
  useLevelLabels:true,
  customLevels: {
    blinfo:25,
    perf: 25
  },
  prettyPrint: {colorize:false,translateTime:"SYS:yyyy-mm-dd HH:MM:ss.l",ignore: 'pid,hostname' }
})


global.__base = path.resolve(__dirname, "..");

global.__app = {
  require:function(a,b) {
    return require(path.resolve(a,b))
  },
  _: _,
  lodash: _,
  base: __base,
  bin: path.resolve(__base, "bin"),
  lib: path.resolve(__base, "lib"),
  examples :path.resolve(__base, "examples"),
  confDir: path.resolve(__base, "config"),
  moment: moment,
  json: json5,
  config : {}
};
const Config = require(path.resolve(__app.lib, "config"));

const utils = require(path.resolve(__app.lib, "utils"));

__app.hash = utils.md5;

__app.local = {
  lastEcho: new Date().getTime(),
};

global.Joi = Joi;
__app.logger = pinoLogger ;
__app.error = require(path.resolve(__app.lib, "error"));
__app.dal = require(path.resolve(__app.lib, "dal"));
__app.routesPath = path.resolve(__app.base, "routes");

__app.date = require(path.resolve(__app.lib, "date"));
__app.cache = {};
__app.ts = utils.ts;
__app.utils = utils;
if (process.env.DATAHUB_ENV) {
  Object.assign(__app.config ,new Config().getConfig(),{loaded:true});
}

async function bootstrap(args) {
  __app.args = args;
  __app.logger.info("server  start with:",args)
  Object.assign(__app.config ,new Config(args.env).getConfig(),{loaded:true});
  __app.client = require(path.resolve(__app.lib, "client"));
  __app.logger.level =  __app.args.l || __app.config.logLevel || "info";

  await __app.dal.init(__app.config);

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
