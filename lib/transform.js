module.exports = class Transform { 
    constructor(params) { 
        this.functions={}
    }
    init() { 
        this.functions.round = {func:'lodash.round',parms:['int'],desc:"Computes number rounded to precision."};
        this.functions.lowerCase = {func:'lodash.lowerCase',desc:"Computes number rounded to precision."};
        this.functions.replace = {func:'lodash.replace',parms:['string','string'],desc:"Replaces matches for pattern in string with replacement."};
        this.functions.trim = {func:'lodash.trim',desc:"Removes leading and trailing whitespace or specified characters from string."};
        this.functions.toUpper = {func:'lodash.toUpper',desc:"Converts string, as a whole, to upper case "};
        this.functions.toLower = {func:'lodash.toLower',desc:"Converts string, as a whole, to lower case "};
        this.functions.ceil = {func:'lodash.ceil',parms:['int'],desc:"Computes number rounded up to precision"};
        this.functions.floor = {func:'lodash.floor',parms:['int'],desc:"Computes number rounded down to precision."};
        this.functions.inRange = {func:'lodash.inRange',parms:['int','int'],desc:"Checks if n is between start and up to, but not including, end. If end is not specified, it's set to start with start then set to 0. If start is greater than end the params are swapped to support negative ranges"};
        this.functions.substr = {func:'lodash.inRange',parms:['int','int'],desc:"substring string"};
    }
}

