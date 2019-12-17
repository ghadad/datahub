exports = module.exports = class {
    constructor(mapper) {
        this.mapper = mapper;
    }

    async discover(data) {
        __app.logger.info("now discover hash fields:", this.mapper.getHashProprties())

        // data.__hash = "dksdksdhsldsd21212kdds12";
        // data.__delta = { firstName:{new:"Banana",old:"Tapuz"}};
        // data.__updated = __app.ts();
        __app.logger.info("pick values:", __app.lodash.pick(data, this.mapper.getHashProprties()))
        return data;

    }
}