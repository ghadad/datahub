const mapObject = require('map-obj');
const delay = require("delay");
module.exports = class {
    constructor(maps) {
        this.maps = maps

    }

    async propertyMapp(rule, rawData, newData) {
        let val;

        if (rule.key) {
            val = rawData[rule.key]
        }

        if (rule.const || rule.value) {
            val = (rule.const || rule.value);
        }

        if (rule.query) {
            let queryResult = await __app.dal.getOne(rule.query);
            val = queryResult.val;
        }

        if (rule.package) {
            val = [1, 2, 3, 4]
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
        for (let rule of this.maps) {
            let singleProperty = {};
            singleProperty[rule.key] = data[rule.key];
            Object.assign(newObject, mapObject(singleProperty, await self.propertyMapp(rule, data, newObject)))
        }
        __app.logger.info("now mapping ! , validate  ,sanitize,normalize", newObject);
        return newObject;
    }
}