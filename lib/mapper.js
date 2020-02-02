const mapObject = require('map-obj');
const delay = require("delay");
const rfs = require("require-from-string");

module.exports = class {
    constructor(maps) {
        this.maps = maps
        console.log(this.maps)
        for (let rule of this.maps) {
            if (rule.handler)
                rule.handler = rfs('module.exports = ' + rule.handler)
        }

    }

    async propertyMapp(rule, rawData, newData) {
        let val;
        console.log("rule:::::::::::::", rule);
        if (rule.originType == "collector" && rule.goTo && rule.targetType == "property" && rule.origin) {
            val = rawData[rule.origin]
        }

        if (rule.const || rule.value) {
            val = (rule.const || rule.value);
        }

        if (rule.query) {
            let queryResult = await __app.dal.getOne(rule.query, {}, {
                dbAlias: rule.dbAlias
            });
            val = queryResult.val;
        }

        if (rule.package) {
            val = [1, 2, 3, 4]
        }


        for (let t of (rule.transform || [])) {

            if (typeof t == "function") {
                val = t(val, rawData, newData);
                continue;
            }
            let func = t[0];
            let params = __app.lodash.clone(t);
            params[0] = val;

            if (!__app.lodash[func]) throw new Error(`Transformer ${func} not found`);

            val = __app.lodash[func].apply(null, params);
            console.log(func, val)
        }

        if (rule.handler) {
            val = rule.handler(val, rawData, newData);
        }

        return function (k, v) {
            return [rule.goTo, val];
        }
    }

    async map(data) {
        let self = this;
        let newObject = {};
        if (data._id)
            newObject._id = data._id;
        for (let rule of this.maps) {
            let singleProperty = {};
            singleProperty[rule.key] = data[rule.key];
            Object.assign(newObject, mapObject(singleProperty, await self.propertyMapp(rule, data, newObject)))
        }
        __app.logger.info("now mapping ! , validate  ,sanitize,normalize", newObject);
        return newObject;
    }

    getConfig() {
        return this.maps;
    }

    getInvolvedDbAliases() {
        return this.maps.filter(m => m.dbAlias).map(m => m.dbAlias);
    }

    getHashProprties() {
        return this.maps.filter(m => m.hash).map(m => m.goTo);
    }
}