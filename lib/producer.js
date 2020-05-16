const Handlebars = require("handlebars");
const Pug = require("pug");
const Mustache = require("mustache");
const Ejs = require("ejs");
const Csv = require("./csv");

const fs = require("fs");
const rfs = require("require-from-string");
const request = require("request");
const hl = require("highland");
const mkdirp = require('mkdirp')
const jsonfile = require('jsonfile')
const upath = require("upath");

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

    getResult(engine = "mustache", templateString, data) {
        let compiledFunction;
        switch (engine) {
            case "mustache":
                return Mustache.render(templateString, data);
            case "pug":
                compiledFunction = Pug.compileFile(templateString);
                return compiledFunction(data);
            case "handlebars":
                compiledFunction = Handlebars.compile(templateString);
                return compiledFunction(data);
            case "ejs":
                return Ejs.render(templateString, data);
        }
    }

    async getAttachment(type = "csv", data, options = {}) {
        options.filename = options.filename || ("file." + type);
        let csvFormatter = new Csv();

        switch (type) {
            case "txt":
            case "text":
                return {
                    filename: options.filename,
                        content: data
                };
            case "csv":
            default:
                let csvFormatter = new Csv();
                return {
                    filename: options.filename,
                        content: await csvFormatter.createString(data)
                }
        }
    }


    validate() {

    }

    interpolate(name, data) {
        return Mustache.render(name, data);
    }
    async produce(data) {
        await mkdirp(upath.resolve(__app.config.interfacesPath, this.config.directory));
        let filePath = this.interpolate(upath.resolve(__app.config.interfacesPath,
            this.config.directory,
            this.config.fileName), data)
        let fd = fs.openSync(filePath, 'w');
        let result = this.getResult(this.config.engine, this.config.template, data);
        if (this.config.type == "JSON") {
            let jsonOptions = {};
            if (this.config.prettify)
                Object.assign(jsonOptions, {
                    spaces: 2,
                    EOL: '\r\n'
                })
            let objResult = __app.json.parse(result);


            await jsonfile.writeFile(fd, objResult, jsonOptions);
            __app.logger.info("interface product created :", filePath);
            return;
        }
        return new Promise(function (resolve, reject) {
            fs.write(fd, result, function (err, res) {
                if (err) {
                    return reject(err);
                };
                __app.logger.info("interface product created :", filePath);
                return resolve({
                    "ok": true
                })
            });
        })




    }


    test(limit) {

    }
}