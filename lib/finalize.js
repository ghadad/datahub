const crypto = require("crypto");
const fastJsonStringify = require("fast-json-stringify");
const rfc6902 = require("rfc6902");
var jsondiffpatch = require('jsondiffpatch').create();

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

    async finalizeInterfaceRow(rowObject, collectorData = {}) {

        let newData = rowObject.tempData.new;
        let oldData = rowObject.tempData.old;

        //        console.log(newData, oldData)
        let hasNew = Object.keys(newData).length;
        let hasOld = Object.keys(oldData).length;

        delete newData.$vars;
        delete oldData.$vars;
        let newRelevantData = __app.lodash.pick(newData, this.mapper.getHashProprties());
        let oldRelevantData = __app.lodash.pick(oldData, this.mapper.getHashProprties());
        //  let patch = rfc6902.createPatch(this.jsonClone(newRelevantData), this.jsonClone(oldRelevantData));

        var newCloneData = JSON.parse(JSON.stringify(newRelevantData), jsondiffpatch.dateReviver);
        var oldCloneData = JSON.parse(JSON.stringify(oldRelevantData), jsondiffpatch.dateReviver);

        let patch = jsondiffpatch.diff(newCloneData, oldCloneData);
        Object.assign(rowObject, {
            delta: {
                hashProps: this.mapper.getHashProprties(),
                newRelevantData: newRelevantData,
                oldRelevantData: oldRelevantData,
                patch: patch,
                deleted: hasOld && !hasNew,
                newAdded: hasNew && !hasOld,
                change: patch === undefined ? false : true
            }
        });
        return rowObject;


    }

    async finalize(newData, oldData = {}, collectorData = {}) {
        __app.logger.debug("start  finalize data:", "new:", newData, "exists:", oldData, "collector:", collectorData)
        let relevantData = __app.lodash.pick(newData, this.mapper.getHashProprties());


        let hashKey = 'hash_' + this.flow.flowKey;
        delete newData.$vars;

        newData.$control = {};

        newData.$control.created = __app.lodash.get(oldData.$control, "created", __app.ts())

        let newHash = crypto.createHash('md5').update(JSON.stringify(relevantData)).digest("hex");
        let oldHash = __app.lodash.get(oldData.$control, hashKey, null);
        let oldVersion = __app.lodash.get(oldData.$control, 'version', 0);
        let newVesion = oldVersion + 1;
        let patchDate = __app.lodash.get(oldData.$control, 'updated', 0);
        let oldPatch = __app.lodash.get(oldData.$control, 'patch', null);

        newData.$control[hashKey] = newHash


        if (oldData._id && oldData._rev && oldHash) {
            newData.$control.updated = __app.ts();
            newData._rev = oldData._rev;
            if (oldHash === newHash) {
                newData.$control.change = false;
                if (oldPatch) {
                    newData.$control.patch = oldPatch;
                    newData.$control.patchDate = patchDate;
                }

            } else {
                newData.$control.patch = rfc6902.createPatch(this.jsonClone(newData), this.jsonClone(oldData))
                newData.$control.change = true;
                newData.$control.version = newVesion;
                newData.$control.patchDate = patchDate;
            }
        } else {
            newData.$control.new = true;
            newData.$control.version = newVesion;
        }

        return newData;
    }
}