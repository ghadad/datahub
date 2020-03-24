const crypto = require("crypto");
const fastJsonStringify = require("fast-json-stringify");
const rfc6902 = require("rfc6902");

exports = module.exports = class {
    constructor(flow, mapper) {
        this.mapper = mapper;
        this.flow = flow;
    }

    jsonClone(obj = {}) {
        let na = {
            ...obj
        }
        delete na.$control;
        delete na._rev;
        return na;
    }

    async finalize(newData, oldData = {}, collectorData = {}) {
        __app.logger.debug("start  finalize data:", "new:", newData, "exists:", oldData, "collector:", collectorData)
        let relevantData = __app.lodash.pick(newData, this.mapper.getHashProprties());


        let hashKey = 'hash_' + this.flow.name;
        delete newData.$vars;
 
        newData.$control = {};

        newData.$control.created = __app.lodash.get(oldData.$control, "created", __app.ts())

        let newHash = crypto.createHash('md5').update(JSON.stringify(relevantData)).digest("hex");
        let oldHash = __app.lodash.get(oldData.$control, hashKey, null);
        let oldVersion = __app.lodash.get(oldData.$control, 'version', 0);
        let newVesion = oldVersion+1 ;
        newData.$control[hashKey] = newHash

        if (oldData._id && oldData._rev && oldHash) {
            newData.$control.updated = __app.ts();
            newData._rev = oldData._rev;

            if (oldHash === newHash) {
                newData.$control.change = false;
            } else {
                if (this.flow.createRevisions)
                    newData.$control.patch = rfc6902.createPatch(this.jsonClone(newData), this.jsonClone(oldData))
                newData.$control.change = true;
                newData.$control.version = newVesion;
            }
        } else {
            newData.$control.new = true;
            newData.$control.version = newVesion;
        }


        __app.logger.debug("now finalize hash:", newData);
        return newData;
    }
}