const mapObject = require('map-obj');
const delay = require("delay");
const rfs = require("require-from-string");
const Transformer = require("./transformer");
const Validator = require("./validator");
var _eval = require('eval')

let evalTemplate = `module.exports = function(rawData,newData) { 
                        return __eval__ ;
}`

let internals = {
    evals: {

    }
}

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

        if (rule.originType == "value" && rule.originValue) {
            val = rule.originValue;
        }

        if (rule.originType == "eval" && rule.originEval) {
            let evalHash;
            if (!internals.evals[evalHash]) {
                evalHash = __app.hash(rule.originEval);
                let evalCode = evalTemplate.replace(/__eval__/, rule.originEval);
                internals.evals[evalHash] = rfs(evalCode);
            }
            val = internals.evals[evalHash](rawData, newData);
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

        if (rule.targetType === "property")
            return function (k, v) {
                return [rule.goTo, val];
            }
        else if (rule.targetType === "variable")
            return function (k, v) {
                return [rule.goToVar, val];
            }
    }

    async map(data) {
        let self = this;
        let newObject = {
            $vars: {}
        };
        if (data._id)
            newObject._id = data._id;
        for (let rule of this.maps) {
            let singleProperty = {};
            singleProperty[rule.key] = data[rule.key];
            if (rule.targetType === "property")
                Object.assign(newObject, mapObject(singleProperty, await self.propertyMapp(rule, data, newObject)))
            else if (rule.targetType === "variable")
                Object.assign(newObject.$vars, mapObject(singleProperty, await self.propertyMapp(rule, data, newObject)))

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