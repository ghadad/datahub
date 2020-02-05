const moment = require("moment");
const lodash = require("lodash");

class Transformer {
    constructor(params) {
        this.functions = {}
        this.init();
    }
    init() {
        this.functions.customFunction = {
            params: [{
                label: "Handler return new Value",
                type: 'code',
                required: true
            }],
            desc: "custom handler that retreive new value."
        };
        this.functions.round = {
            func: lodash.round,
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded to precision."
        };
        this.functions.lowerCase = {
            func: lodash.lowerCase,
            desc: "Computes number rounded to precision."
        };
        this.functions.replace = {
            func: lodash.replace,
            params: [{
                label: "what",
                type: 'text'
            }, {
                label: "replacement",
                type: 'text'
            }],
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
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded up to precision"
        };
        this.functions.floor = {
            func: lodash.floor,
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded down to precision."
        };

        this.functions.substr = {
            func: this.substr,
            params: [{
                label: "From char",
                type: 'number',
                required: true
            }, {
                label: "Length",
                type: 'number',

            }],
            desc: "substring string"
        };
        this.functions.dateFormat = {
            func: this.dateFormat,
            params: [{
                label: "Date format",
                type: 'text',
                required: true
            }],
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

    getFunctions() {
        return this.functions;
    }
}

module.exports = new Transformer();