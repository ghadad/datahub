const moment = require("moment");
const lodash = require("lodash");

 class Transformer {
    constructor(params) {
        this.functions = {}
        this.init();
    }
    init() {
        this.functions.customTransform = {
            params: ['textarea'],
            desc: "custom handler that retreive new value."
        };
        this.functions.round = {
            func: lodash.round,
            params: ['int'],
            desc: "Computes number rounded to precision."
        };
        this.functions.lowerCase = {
            func: lodash.lowerCase,
            desc: "Computes number rounded to precision."
        };
        this.functions.replace = {
            func: lodash.replace,
            params: ['string', 'string'],
            desc: "Replaces matches for pattern in string with replacement."
        };
        this.functions.trim = {
            func: lodash.trim,
            desc: "Removes leading and trailing whitespace or specified characters from string."
        };
        this.functions.toUpper = {
            func: lodash.toUpper,
            desc: "Converts string, as a whole, to upper case "
        };
        this.functions.toLower = {
            func: 'lodash.toLower',
            desc: "Converts string, as a whole, to lower case "
        };
        this.functions.ceil = {
            func: lodash.ceil,
            params: ['int'],
            desc: "Computes number rounded up to precision"
        };
        this.functions.floor = {
            func: lodash.floor,
            params: ['int'],
            desc: "Computes number rounded down to precision."
        };
        this.functions.inRange = {
            func: lodash.inRange,
            params: ['int', 'int'],
            desc: "Checks if n is between start and up to, but not including, end. If end is not specified, it's set to start with start then set to 0. If start is greater than end the params are swapped to support negative ranges"
        };
        this.functions.substr = {
            func: this.substr,
            params: ['int', 'int'],
            desc: "substring string"
        };
        this.functions.dateFormat = {
            func: this.dateFormat,
            params: ['string'],
            desc: "date format"
        };
    }
    exec(func, val, params = []) {
        let newParams = [val, ...params];
        return (this.functions[func].func).apply(null, newParams)
    }

    substr(p1, p2, p3) {
        return String(p1).substr(p2, p3)
    }
    dateFormat(p1, p2) {
        return moment(p1).format(p2);
    }
    
    getFunctions(){
        return this.functions;
    }
}

module.exports = new Transformer();