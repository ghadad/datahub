'use strtict'
const path = require("path");
var glob = require("glob");
const lodash = require("lodash");
const lowdb = require("lowdb");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const FileAsync = require('lowdb/adapters/FileAsync')

class Config {
    constructor(env = null) {
        this.dbs = {};
        if (__app.config.loaded)
            return;
        this.envPrefix = "";
        this.env = env || lodash.get(__app.args, 'env') || process.env.DATAHUB_ENV;
        if (!this.env) {
            throw new __app.error("missing --env arg or DATAHUB_ENV env var", {
                fatal: true
            });
        }
        this.env = this.env.toLowerCase();
        process.RTDATA_ENV = this.env;
        this.envConfDir = path.resolve(__app.confDir, this.env);
        this.config = {
            envConfDir: this.envConfDir
        };
        let envConf = this.loadDir(this.envConfDir);
        let rootConf = this.loadDir(__app.confDir);

        Object.assign(this.config, rootConf, envConf);

        let self = this;
        //        self.config.redis.url = 'redis://' + self.config.redis.master.host + ':' + self.config.redis.master.port;
        self.config.env = this.env;
        __app.config.loaded = true;

    }
    getEnvPath() {
        return this.envConfDir;
    }

    loadDir(dir) {
        var internal = {};
        var index = glob.sync(dir + "/index.js");
        if (index[0])
            internal = require(index[0]);
        Object.assign(this.config, internal);
        Object.assign(__app.config, this.config);
        var toBeExport = glob.sync(dir + "/*.js").forEach(function (file) {
            if (file.match(/index.js$/)) return true;
            var newfile = path.basename(file);
            var basefile = path.basename(newfile, ".js").replace(".index", "");
            internal[basefile] = require(file);
            __app.logger.debug('Load "' + basefile + '" module');
        });
        var toBeExport = glob.sync(dir + "/*.json").forEach(function (file) {
            if (file.match(/index.json$/)) return true;
            var newfile = path.basename(file);
            var basefile = path.basename(newfile, ".json").replace(".index", "");
            internal[basefile] = require(file);
            __app.logger.debug('Load "' + basefile + '" module');
        });
        return internal;
    };

    getConfig() {
        return this.config;
    }

    createDbSync(name, path) {
        let adapter = new FileSync(path)
        this.dbs[name] = low(adapter);
        return this.dbs[name];
    }

    createDbAsync(name, path) {
        let adapter = new FileAsync(path)
        this.dbs[name] = low(adapter);
        return this.dbs[name];
    }

    getDb(name) {
        return this.dbs[name];
    }
    getDbState(name) {
        return this.dbs[name].getState();
    }

}


module.exports = Config;