const mapObject = require('map-obj');
const delay = require("delay");
const rfs = require("require-from-string");
const Transformer = require("./transformer");
const Validator = require("./validator");
var _eval = require('eval')

module.exports = class {
    constructor(maps) {
        this.maps = maps
        for (let rule of this.maps) {
            if (rule.handler)
                rule.handler = rfs('module.exports = ' + rule.handler)
        }

    }



    async propertyMapp(rule, rawData, newData) {
        let val;
        if (rule.originType == "collector" && rule.goTo && rule.targetType == "property" && rule.originCollector) {
            val = rawData[rule.originCollector]
        }
        if (rule.originType == "eval" && rule.originEval) {
            val = _eval('module.exports = ' + rule.originEval)
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
            let [func, ...params] = __app.lodash.clone(t);
            val = Transformer.exec(val, func, params);
        }

        for (let t of (rule.validate || [])) {
            let [func, ...params] = __app.lodash.clone(t);
            let isValid = Validator.exec(val, func, params);
            if (!isValid) throw new __app.error(`${rule.name} rule ->val : "${val}" didn't pass validation test : ${func} ${params}`, {
                code: "INVALID"
            });
        }

        for (let t of (rule.drop || [])) {
            let [func, ...params] = __app.lodash.clone(t);
            let isDrop = Validator.exec(val, func, params);

            if (isDrop) throw new __app.error(`${rule.name} rule ->val : "${val}"  pass drop test : ${func} ${params}`, {
                code: "DROP"
            });
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
        __app.logger.debug("now mapping ! , validate  ,sanitize,normalize", newObject);
        return newObject;
    }

    getConfig() {
        return this.maps;
    }

    getInvolvedDbAliases() {
        return this.maps.filter(m => m.originQueryDbAlias).map(m => m.originQueryDbAlias);
    }

    getHashProprties() {
        return this.maps.filter(m => m.hash).map(m => m.goTo);
    }
}