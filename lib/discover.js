const crypto = require("crypto");
const fastJsonStringify = require("fast-json-stringify");

exports = module.exports = class {
    constructor(mapper) {
        this.mapper = mapper;
    }

    async discover(data) {
       

        // data.__hash = "dksdksdhsldsd21212kdds12";
        // data.__delta = { firstName:{new:"Banana",old:"Tapuz"}};
        // data.__updated = __app.ts();
       // __app.logger.info("pick values:", __app.lodash.pick(data, this.mapper.getHashProprties()))
        let relevantData = __app.lodash.pick(data, this.mapper.getHashProprties());
        data.$hash = crypto.createHash('md5').update(JSON.stringify(relevantData)).digest("hex")
        __app.logger.info("now discover hash:", data)
        return data;
    }
}