const moment = require("moment");
const lodash = require("lodash");
const validator = require('validator');

class Validator {
    constructor(params) {
        this.functions = {}
        this.init();
    }
    init() {
        this.functions.customFunction = {
            params: [{label:"Handler return boolean true/false" ,type:'code'}],
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
            params: ['string'],
            desc: "check if the string is an IP (version 4 or 6)."
        };
        this.functions.inRange = {
            func: lodash.inRange,
            params: ['int', 'int'],
            desc: "Checks if n is between start and up to, but not including, end. If end is not specified, it's set to start with start then set to 0. If start is greater than end the params are swapped to support negative ranges"
        };
    }
    exec(func, val, params = []) {
        let stringVal = new String(val);
        let newParams = [stringVal, ...params];
        return (this.functions[func].func).apply(null, newParams)
    }
    getFunctions(){
        return this.functions;
    }
}

module.exports = new Validator();