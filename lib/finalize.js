const crypto = require("crypto");
const fastJsonStringify = require("fast-json-stringify");

exports = module.exports = class {
    constructor(flow, mapper) {
        this.mapper = mapper;
        this.flow = flow;
    }

    async finalize(newData, oldData = {}, collectorData={}) {

        __app.logger.debug("start  finalize data:", "new:", newData, "exists:", oldData, "collector:", collectorData)
        let relevantData = __app.lodash.pick(newData, this.mapper.getHashProprties());

        
        let hashKey = 'hash_' + this.flow.name;
        delete newData.$vars;

        newData.$control = {} ;

        newData.$control.created =  __app.lodash.get(oldData.$control,"created",__app.ts())

        let newHash = crypto.createHash('md5').update(JSON.stringify(relevantData)).digest("hex");
        let oldHash =  __app.lodash.get(oldData.$control,hashKey,null);
        newData.$control[hashKey] = newHash

        if (oldData._id && oldData._rev && oldHash) {
            newData.$control.updated = __app.ts();
            newData.$control.newHash  = newHash;
            newData.$control.oldHash  = oldHash;
            newData._rev = oldData._rev;
            if (oldHash == newHash) {
                newData.$control.change = false;
            } else {
                newData.$control.change = true;
            }
       }

        return newData;
    }
}