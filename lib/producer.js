const Handlebars = require("handlebars");
const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request");
const hl = require("highland");
const mkdirp = require('mkdirp')

Handlebars.registerHelper('fixed', function (value, justify, length, chars = ' ') {

    if (justify == 'right')
        return __app.lodash.padStart(value, length, chars);

    else if (justify == 'left')
        return __app.lodash.padEnd(value, length, chars);

    return __app.lodash.padEnd(value, length, chars);
})


const internals = {}

exports = module.exports = class Producer {
    constructor(config) {
        this.name = "producer"
        this.config = config;

    }


    init() {

    }


    async produce(data) {
        await mkdirp("/home/golanh");
        let fd = fs.openSync('/home/golanh/output.html', 'w')
        let template = Handlebars.compile(this.config.template);
        let resString = template(data);

        return new Promise(function (resolve, reject) {
            fs.write(fd, resString, function (err, res) {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    "ok": true
                })
            });
        })




    }


    test(limit) {

    }
}