const crypto = require("crypto");
const fastJsonStringify = require("fast-json-stringify");
const rfc6902 = require("rfc6902");

exports = module.exports = class {
    constructor(flow, mapper) {
        this.mapper = mapper;
        this.flow = flow;
    }

    async finalize(newData, oldData = {}, collectorData = {}) {

        __app.logger.debug("start  finalize data:", "new:", newData, "exists:", oldData, "collector:", collectorData)
        let relevantData = __app.lodash.pick(newData, this.mapper.getHashProprties());
        delete newData.$vars;
        newData.$hash = oldData.$hash || {};
        let newHash = crypto.createHash('md5').update(JSON.stringify(relevantData)).digest("hex")
        newData.$hash[this.flow.name] = newHash
        if (oldData._id && oldData._rev && oldData.$hash) {
            newData.updated = __app.ts();
            if (oldData.created) newData.created = oldData.created;
            let oldHash = oldData.$hash[this.flow.name];

            if (oldHash == newHash) {
                newData.$change = false;
                newData._rev = oldData._rev;
            } else {
                newData.$change = true;

                rfc6902.createPatch(oldData, newData)
            }
        } else {
            newData.created = __app.ts();
        }



        __app.logger.debug("now finalize hash:", newData);
        return newData;
    }
}