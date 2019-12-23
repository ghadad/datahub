const axios = require("axios");
const async = require("async");
const path = require("path");
const os = require("os");
var hash = require('object-hash');
const md5 = require('md5');
const sparkMd5 = require("./spark-md5")
const fs = require("fs");
const upath = require("upath");

const DATE_MASK = 'YYYYMMDD';
const FUTURE_DATE = '47001230';
const HISTORICAL_DATE = '19600101';

const allFilesSync = (dir, filelist = []) => {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = allFilesSync(path.join(dir, file), filelist);
        } else {
            if (!file.match(/\.js$/))
                return;
            let filePath = path.join(dir, file);
            let prefix = filePath.replace(__app.routes, "").replace(/\/+/, '/').
            replace(/[\/\\]index.js$/, "").replace('//', '/').replace(/\.js$/, "")
                .replace(/\\+/g, '/') || '/';
            filelist.push({
                prefix: prefix,
                path: filePath
            });
        }
    });
    return filelist;
}


module.exports.applyRoutes = function (arg1, arg2, arg3) {
    let directory = "";
    let prefix = "/";
    let fastify = null;
    if (typeof arg3 == "undefined") {
        prefix = '/';
        directory = arg1;
        fastify = arg2;
    } else {
        prefix = '/' + arg1.replace('/', '') + '/';
        directory = arg2;
        fastify = arg3;
    }

    let routes = allFilesSync(directory);

    for (let r of routes) {
        let normalDirectory = upath.normalize(directory);
        let normalPrefix = upath.normalize(r.prefix);
        let relativePath = normalPrefix.replace(normalDirectory, "");

        let url = upath.normalize(prefix + relativePath);
        __app.logger.debug("url:", url);
        fastify.register(require(r.path), {
            prefix: url
        });
    }
    return true;
}



const ts = function (format = null) {
    switch (format) {
        case "pretty-short":
            return __app.moment().format('YYYY-MM-DD HH:mm');
            break;
        case "pretty":
            return __app.moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            break;
        case "seconds":
            return Date.now() / 1000;
            break;
        default:
            return Date.now()
    }
}

module.exports.ts = ts;
module.exports.getType = function (obj) {
    if (__app.lodash.isArray(obj))
        return "array";
    else if (__app.lodash.isObject(obj))
        return "object";
    return "scalar";
}


module.exports.hash = function (val, keys) {

    if (!val)
        throw new __app.error("hash maker get invalid val !check your code !");

    if (typeof keys === "undefined" || typeof keys === "string " || !keys)
        return hash.MD5(val);



    if (Array.isArray(keys)) {

        let valKeys = {};
        keys.forEach((k) => {
            valKeys[k] = __app.lodash.toString(val[k]);
        });


        return hash.MD5(valKeys, {
            respectType: false
        });

    }

    if (__app.lodash.isObject(keys))
        return hash.MD5(val, {
            respectType: false,
            excludeKeys: function (k) {
                return !(k in keys);
            }
        })
}


module.exports.md5_native = function (val, keys) {
    if (!val)
        throw new __app.error("hash maker get invalid val !check your code !");
    else if (typeof val === "string")
        return md5(Buffer.from(val))
    else if (Array.isArray(val) && val[0] && typeof val[0] == "object" && !keys)
        return md5(Buffer.from(JSON.stringify(val)));
    else if (Array.isArray(val) && val[0] && typeof val[0] !== "object")
        return md5(Buffer.from(Object.values(val).join("|")));
    else if (Array.isArray(keys)) {
        let valKeys = {};
        keys.forEach((k) => {
            valKeys[k] = val[k];
        });
        return md5(Buffer.from(Object.values(valKeys).join("|")));
    } else if (__app.lodash.isObject(keys)) {
        let valKeys = {};
        for (let k in keys) {
            if (keys[k]) valKeys[k] = val[k];
        }
        return md5(Buffer.from(Object.values(valKeys).join("|")));
    } else {
        return md5(Buffer.from(Object.values(val).join("|")));
    }
}

module.exports.md5 = function (val, keys) {
    if (!val)
        throw new __app.error("hash maker get invalid val !check your code !");
    else if (typeof val === "string")
        return sparkMd5.hash(val)
    else if (Array.isArray(val) && val[0] && typeof val[0] == "object" && !keys)
        return sparkMd5.hash(JSON.stringify(val));
    else if (Array.isArray(val) && val[0] && typeof val[0] !== "object")
        return sparkMd5.hash(Object.values(val).join("|"));
    else if (Array.isArray(keys)) {
        let valKeys = {};
        keys.forEach((k) => {
            valKeys[k] = val[k];
        });
        return sparkMd5.hash(Object.values(valKeys).join("|"));
    } else if (__app.lodash.isObject(keys)) {
        let valKeys = {};
        for (let k in keys) {
            if (keys[k]) valKeys[k] = val[k];
        }
        return sparkMd5.hash(Object.values(valKeys).join("|"));
    } else {
        return sparkMd5.hash(Object.values(val).join("|"));
    }
}


module.exports.farmHash = function (val, keys) {
    if (!val)
        throw new __app.error("hash maker get invalid val !check your code !");
    else if (typeof val === "string")
        return farmhash.hash64(new Buffer(val));
    else if (Array.isArray(val) && val[0] && typeof val[0] == "object" && !keys)
        return farmhash.hash64(new Buffer(JSON.stringify(val)));
    else if (Array.isArray(val) && val[0] && typeof val[0] !== "object")
        return farmhash.hash64(new Buffer(Object.values(val).join("|")));
    else if (Array.isArray(keys)) {
        let valKeys = {};
        keys.forEach((k) => {
            valKeys[k] = val[k];
        });
        return farmhash.hash64(new Buffer(Object.values(valKeys).join("|")));
    } else if (__app.lodash.isObject(keys)) {
        let valKeys = {};
        for (let k in keys) {
            if (keys[k]) valKeys[k] = val[k];
        }
        return farmhash.hash64(new Buffer(Object.values(valKeys).join("|")));
    } else {
        return farmhash.hash64(new Buffer(Object.values(val).join("|")));
    }
}


module.exports.sum = function () {
    for (arg of arguments) {
        if (!__app.lodash.isNumber(arg))
            throw new __app.error("sum:wrong number type :[" + arg + "]")
    }
    return __app.math.add.apply(this, arguments);
}

module.exports.flexSum = function () {
    for (argKey in arguments) {
        if (arguments[argKey] == null || typeof arguments[argKey] === "undefined") {
            arguments[argKey] = 0;
        }
        let validValue = __app.lodash.toNumber(arguments[argKey]);

        if (validValue != validValue)
            throw new __app.error("sum:wrong number type :[" + arguments[argKey] + "]");

        arguments[argKey] = validValue;

    }
    return __app.math.add.apply(this, Object.values(arguments));
}

module.exports.multiply = function () {
    let idx = 0;
    for (argKey in arguments) {
        if (!isNumber(arguments[argKey])) {
            throw new __app.error("multiply:invalid arg  :[" + arguments[argKey] + "] is empty on arg index :" + idx);
        }
        idx++;
    }
    return __app.math.round(__app.math.multiply.apply(this, Object.values(arguments)), __app.config.macros.DECIMAL_PERCISION);
}

const isNumber = function (val) {
    if ((val == null || typeof val === "undefined") ||
        __app.lodash.isNaN(__app.lodash.toNumber(val)))
        return false;
    return true;
}


module.exports.isNumber = isNumber;

module.exports.substract = function (a, b) {
    if (isNumber(a) && isNumber(b))
        return (a - b);
    throw new __app.error(`substract:wrong number type a=${a} b=${b}`);
}


module.exports.getMaxStr = function () {

    return (__app.lodash.orderBy(__app.lodash.compact(arguments), [], ["desc"])[0] || null);

}


module.exports.getMinStr = function (a, b) {

    return (__app.lodash.orderBy(__app.lodash.compact(arguments), [], ["asc"])[0] || null);

}


module.exports.getMaxNum = function () {
    return __app.lodash.toNumber(__app.lodash.max(arguments)) || null;

}


module.exports.getMinNum = function () {
    let idx = 0;
    for (arg of arguments) {
        if (!isNumber(arg))
            throw new __app.error("getMinNum:wrong number type :[" + arg + "] on arg index :" + idx)
        idx++;
    }

    return __app.lodash.toNumber(__app.lodash.min(arguments));
}


function isStrDate(dt) {
    dt = dt || '';
    if (dt.length !== DATE_MASK.length) {
        throw new __app.error('input date <' + dt + '>  is empty or date mask wrong ')
    }

    dt = __app.moment(dt, DATE_MASK);
    if (!dt.isValid())
        throw new __app.error('date <' + dt + '> is not a date  format')

    return dt;

}


function validateDates() {

    let arr = Array.prototype.slice.call(arguments);

    return arr.map(isStrDate);
}


module.exports.addDays = function (date, days) {

    date = date || '';
    if (date.length != DATE_MASK.length) {
        throw new __app.error('input date is empty or date mask wrong ')
    }

    if (date === FUTURE_DATE) return FUTURE_DATE;

    date = __app.moment(date, DATE_MASK);
    if (!date.isValid())
        throw new __app.error('input is not a date format')

    days = days || 0;
    if (days < 0)
        throw new __app.error('days diff must not be negative')

    return date.add(__app.lodash.toNumber(days), 'days').format(DATE_MASK);

}


module.exports.subDays = function (date, days) {

    date = date || '';
    if (date.length != DATE_MASK.length) {
        throw new __app.error('input date is empty or date mask wrong ')
    }

    if (date === HISTORICAL_DATE) return HISTORICAL_DATE;

    date = __app.moment(date, DATE_MASK);

    if (!date.isValid())
        throw new __app.error('input is not a date format')

    days = days || 0;
    if (days < 0)
        throw new __app.error('days diff must not be negative')

    return date.subtract(__app.lodash.toNumber(days), 'days').format(DATE_MASK);


}


module.exports.daysDiff = function (date1, date2) {

    if (arguments.length !== 2) {
        throw new __app.error('daysDiff argument missing')
    }
    [date1, date2] = validateDates(date1, date2);
    return __app.math.abs(date1.diff(date2, 'days'));
}

module.exports.isDateBetween = function (inputDate, date1, date2) {

    if (arguments.length !== 3) {
        throw new __app.error('isBetweenTst argument missing')
    }

    [inputDate, date1, date2] = validateDates(inputDate, date1, date2);

    if (date1 > date2)
        return (inputDate.isBetween(date2, date1) || inputDate.isSame(date1) || inputDate.isSame(date2));

    return (inputDate.isBetween(date1, date2) || inputDate.isSame(date1) || inputDate.isSame(date2));

}