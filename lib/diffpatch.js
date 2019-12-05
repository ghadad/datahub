const jsondiffpatch = require("jsondiffpatch");
module.exports = class Diffpatch { 
    constructor(params){

    }

    diff(data1,data2){
        var delta = jsondiffpatch.diff(country, country2);
        return delta;
    }

    patch(data,delta){
        jsondiffpatch.patch(country, delta);
    }
}