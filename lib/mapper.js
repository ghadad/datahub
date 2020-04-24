const mapObject = require('map-obj');
const delay = require("delay");
const rfs = require("require-from-string");
const Transformer = require("./transformer");
const Validator = require("./validator");
var _eval = require('eval')
const knex = require("knex");
const vv = require('validator');

let evalTemplate = `module.exports = function(rawData,newData,oldData) { 
                        let $vars = newData.$vars ;
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
            if (rule.originHandler)
                rule.originHandler = rfs('module.exports = ' + rule.originHandler)
            if (rule.originCollector)
                rule.originCollector = rule.originCollector.replace(/\w+:/, "");
        }
    }


    getStatProps() {
        let props = [];
        for (let rule of this.maps.filter(r => r.statInd)) {
            props.push(rule.originProperty)
        }
        return props;
    }
    async propertyMapp(rule, rawData, newData, oldData) {
        let val;
        rule.transform = rule.transform || [];
        rule.validate = rule.validate || [];
        rule.drop = rule.drop || [];
        // normalize Interface rules


        if (rule.originType == "collector" && rule.goTo && rule.targetType == "property" && rule.originCollector) {
            val = rawData[rule.originCollector];

        }

        if (rule.originType == "value" && rule.originValue) {
            val = rule.originValue;
        }

        if ((rule.originType == "eval" || rule.origin == "eval") && rule.originEval) {
            let evalHash, evalCode;
            try {
                if (!internals.evals[evalHash]) {
                    evalHash = __app.hash(rule.originEval);
                    evalCode = evalTemplate.replace(/__eval__/, rule.originEval);
                    internals.evals[evalHash] = rfs(evalCode);
                }

                val = internals.evals[evalHash](rawData, newData, oldData);
            } catch (e) {
                throw new Error(`rule ${rule.name} :# ${rule.$index} Failed on evaluate mapper :${e.message}`)
            }
        }

        if ((rule.originType == "query" || rule.origin == "query") && rule.originQuery) {
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

        if (rule.hasTransform && rule.transform.length)
            for (let t of rule.transform) {
                let [func, ...params] = __app.lodash.clone(t);
                val = Transformer.exec(val, func, params);
            }

        if (rule.hasValidation && rule.validate.length)
            for (let t of rule.validate) {
                let [func, ...params] = __app.lodash.clone(t);
                let isValid = Validator.exec(val, func, params);
                if (!isValid) throw new __app.error(`${rule.name||rule.goTo} rule No # ${rule.$index} ->val : "${val}" didn't pass validation test : ${func} ${params}`, {
                    code: "INVALID"
                });
            }
        if (rule.hasDrop && rule.drop.length)
            for (let t of rule.drop) {
                let [func, ...params] = __app.lodash.clone(t);
                let isDrop = Validator.exec(val, func, params);

                if (isDrop) throw new __app.error(`${rule.name||rule.goTo} rule ->val : "${val}"  pass drop test : ${func} ${params}`, {
                    code: "DROP"
                });
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
    normalizeRule(rule) {
        if (rule.origin == "source" && rule.originProperty) {
            Object.assign(rule, {
                targetType: "property",
                goTo: rule.originProperty,
                originType: "collector",
                originCollector: rule.originProperty,
                hash: rule.deltaFactor
            });
        }
        return rule;

    }
    async map(rawData = {}, oldData = {}) {
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
            rule = self.normalizeRule(rule);
            if (rule.targetType === "property")
                Object.assign(newObject, mapObject(singleProperty, await self.propertyMapp(rule, rawData, newObject, oldData)))
            else if (rule.targetType === "variable")
                Object.assign(newObject.$vars, mapObject(singleProperty, await self.propertyMapp(rule, rawData, newObject, oldData)))

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
        return this.maps.filter(m => m.hash || m.deltaFactor).map(m => m.goTo);
    }
}