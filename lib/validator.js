const moment = require("moment");
const lodash = require("lodash");
const validator = require('validator');
const rfs = require("require-from-string");


class Validator {
    constructor(params) {
        this.functions = {}
        this.init();
    }
    init() {
        this.functions.customFunction = {
            func: this.customFunction,
            params: [{
                label: "Handler return new Value",
                type: 'code',
                required: true
            }],
            desc: "custom validation that retreive boolean value true or false."
        };
        this.functions.isEmail = {
            func: validator.isEmail,
            desc: "check if the string is an email."
        };
        this.functions.isEmpty = {
            func: validator.isEmpty,
            desc: "check if the string has a length of zero."
        };
        this.functions.isCreditCard = {
            func: validator.isCreditCard,
            desc: "check if the string is a credit card."
        };
        this.functions.isDecimal = {
            func: validator.isDecimal,
            desc: "check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc."
        };
        this.functions.isInt = {
            func: validator.isInt,

            desc: "check if the string is an integer."
        };
        this.functions.isIP = {
            func: validator.isIP,
            desc: "check if the string is an IP (version 4 or 6)."
        };
        this.functions.inRange = {
            func: lodash.inRange,
            params: [{
                label: "Start ",
                type: 'number',
                required: true
            }, {
                label: "End",
                type: 'number',
                required: true
            }],
            desc: "Checks if n is between start and up to, but not including, end. If end is not specified, it's set to start with start then set to 0. If start is greater than end the params are swapped to support negative ranges"
        };
    }

    exec(val, func, params = []) {

     //   if (val != 0 && !val) return val;
        let realFunc = func;
        let oppositeFound = false;
        if (func.substr(0, 1) == "!") {
            realFunc = func.substr(1);
            oppositeFound = true;
        }
        let retVal ; 
    
        let newParams = [val, ...params].map(p => p + '');
        if (!this.functions[realFunc])
            throw new Error(`no handler found for ${func} function}`);
        const funcRef = this.functions[realFunc].func;
      
        try {
            retVal =   oppositeFound ? !funcRef.apply(null, newParams) : funcRef.apply(null, newParams);
        } catch (e) {
            throw new __app.error(`Failed to invoke function :${realFunc} ${e.message} with params:`, newParams)
        }
        return retVal;
    }

    getFunctions() {
        return this.functions;
    }

    functions(){
        return validator;
    }

    customFunction(val, funcString) {
        let exportsExpr = 'module.exports = ' + funcString;
        let funcRef = rfs(exportsExpr)
        return funcRef(val)
    }
}

module.exports = new Validator();