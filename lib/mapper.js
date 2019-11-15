exports = module.exports = class {
    constructor(params) {
        this.rule = null
        this.filters = []
        this.type = params.type; // "ref" or "value"
        this.created = null;
        this.update = null;
    }
}