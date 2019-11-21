exports = module.exports = new class {
    constructor(config = __app.config) {
        this.config = config ;
    }
    async init() {
        __app.logger.info("init dal :",this.config)
    }
}