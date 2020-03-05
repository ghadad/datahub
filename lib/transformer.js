const moment = require("moment");
const lodash = require("lodash");
const rfs = require("require-from-string");

class Transformer {
    constructor(params) {
        this.functions = {}
        this.init();
    }
    init() {
        let self = this;
        self.functions.customFunction = {
            func: self.customFunction,
            params: [{
                label: "Handler return new Value",
                type: 'code',
                required: true
            }],
            desc: "custom handler that retreive new value."
        };
        self.functions.round = {
            func: lodash.round,
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded to precision."
        };
        self.functions.lowerCase = {
            func: lodash.lowerCase,
            desc: "Computes number rounded to precision."
        };
        self.functions.replace = {
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
        self.functions.trim = {
            func: lodash.trim,
            desc: "Removes leading and trailing whitespace or specified characters from string."
        };
        self.functions.toUpper = {
            func: lodash.toUpper,
            desc: "Converts string, as a whole, to upper case "
        };
        self.functions.toLower = {
            func: lodash.toLower,
            desc: "Converts string, as a whole, to lower case "
        };
        self.functions.ceil = {
            func: lodash.ceil,
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded up to precision"
        };
        self.functions.floor = {
            func: lodash.floor,
            params: [{
                label: "precision",
                type: 'number'
            }],
            desc: "Computes number rounded down to precision."
        };

        self.functions.substr = {
            func: self.substr,
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
        self.functions.dateFormat = {
            func: self.dateFormat,
            params: [{
                label: "Date format",
                type: 'text',
                required: true
            }],
            desc: "date format"
        };
    }
    exec(val, func, params = []) {
        if (val != 0 && !val) return val;
        let newParams = [val, ...params];

        if (!this.functions[func])
            throw new Error(`no handler found for ${func} function}`);
        const funcRef = this.functions[func].func;
        return funcRef.apply(null, newParams)
    }

    substr(p1, p2, p3) {
        return lodash.toString(p1).substr(p2, p3)
    }
    dateFormat(p1, p2) {
        return moment(p1).format(p2);
    }
    customFunction(val, funcString) {
        let exportsExpr = 'module.exports = ' + funcString;
        let funcRef = rfs(exportsExpr)

        return funcRef(val)
    }

    getFunctions() {
        return this.functions;
    }
}

module.exports = new Transformer();