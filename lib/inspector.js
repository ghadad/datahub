exports = module.exports = class {
    constructor(params) {
        this.rule = null
        this.filters = []
        this.type = params.type; // "ref" or "value"
        this.created = null;
        this.update = null;
    }

    async inspect(data) {
        __app.logger.info("now inspect ! , calculate hash , deltas ..etc ")
        data.__hash = "dksdksdhsldsd21212kdds12";
        data.__delta = { firstName:{new:"Banana",old:"Tapuz"}};
        data.__updated = __app.ts();
        return data;

    }
}