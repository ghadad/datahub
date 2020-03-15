const mapObject = require('map-obj');
const delay = require("delay");
const rfs = require("require-from-string");
const Transformer = require("./transformer");
const Validator = require("./validator");
var _eval = require('eval')
const knex = require("knex");

let evalTemplate = `module.exports = function(rawData,newData,$vars) { 
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
            let evalHash, evalCode;
            try {
                if (!internals.evals[evalHash]) {
                    evalHash = __app.hash(rule.originEval);
                    evalCode = evalTemplate.replace(/__eval__/, rule.originEval);
                    internals.evals[evalHash] = rfs(evalCode);
                }

                val = internals.evals[evalHash](rawData, newData);
            } catch (e) {
                throw new Error(`rule ${rule.name} :# ${rule.$index} Failed on evaluate mapper :${e.message}`)
            }
        }

        if (rule.originType == "query" && rule.originQuery) {
            let queryErr;
            let row1Result = await __app.dal.getOne(rule.originQuery, Object.assign({}, rawData, newData), {
                dbAlias: rule.originQueryDbAlias
            }).catch(e => queryErr = e) || {};
            val = __app.lodash.values(row1Result)[0]
            if (queryErr)
                throw new Error(`rule ${rule.name} :# ${rule.$index} Failed on query mapper :${queryErr.message}`)
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
            if (!isValid) throw new __app.error(`${rule.name} rule ->val (${rule.$index}): "${val}" didn't pass validation test : ${func} ${params}`, {
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

    async map(rawData) {
        let self = this;
        let newObject = {
            $vars: {}
        };
        if (rawData._id)
            newObject._id = rawData._id;
        for (let rIdx = 0; rIdx < this.maps.length; rIdx++) {
            let rule = this.maps[rIdx];
            rule.$index = rIdx + 1;

            let singleProperty = {};
            singleProperty[rule.key] = rawData[rule.key];
            if (rule.targetType === "property")
                Object.assign(newObject, mapObject(singleProperty, await self.propertyMapp(rule, rawData, newObject)))
            else if (rule.targetType === "variable")
                Object.assign(newObject.$vars, mapObject(singleProperty, await self.propertyMapp(rule, rawData, newObject)))

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