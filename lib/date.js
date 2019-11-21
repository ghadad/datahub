const moment = require("moment");
const DATETIME_MASK = 'YYYYMMDDHHmmss'
const DATE_MASK = 'YYYYMMDD'

class Str {
  constructor(options) {
    this.options = options;
  }
  now(mask = DATETIME_MASK) {
    return moment().format(mask);
  }

  isValid(d) {
    d += ''
    if (d && d.length == DATETIME_MASK.length) {
      let matches = d.match(/^\d{4}(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
      if (matches[1] >= 1 & matches[1] <= 12 &&
        matches[2] >= 1 & matches[2] <= 31 &&
        matches[3] >= 0 & matches[3] <= 23 &&
        matches[4] >= 0 & matches[4] <= 59 &&
        matches[5] >= 0 & matches[5] <= 59)
        return true;
    }
    if (d && d.length == DATE_MASK.length) {
      let matches = d.match(/^\d{4}(\d{2})(\d{2})/);
      if (matches[1] >= 1 & matches[1] <= 12 &&
        matches[2] >= 1 & matches[2] <= 31
      )
        return true;
    }
    return false;
  }

  getJsDate(date1) {
    if (!(this.isValid(date1))) {
      throw new __app.error("date.str.getJsDate get invalid date", {
        meta: {
          date1: date1
        }
      })
    }
    let date1Mask = this.getMask(date1);
    return moment(date1, date1Mask);
  }

  toEpoch(d) {
    return this.getJsDate(d).valueOf();
  }
  fromEpoch(d) {
    return moment(d).format(DATETIME_MASK)
  }

  getMask(d) {
    d += '';
    if (d && d.length == DATETIME_MASK.length) return DATETIME_MASK;
    if (d && d.length == DATE_MASK.length) return DATE_MASK;
    throw new __app.error("date.str cant resolve datemask", {
      meta: {
        date: d
      }
    })
  }
  between(date1, date2, date3) {
    date1 += ''
    date2 += ''
    date3 += ''

    if (!(this.isValid(date1) && this.isValid(date2) && this.isValid(date3))) {
      throw new __app.error("date.str.between get invalid date", {
        meta: {
          date1: date1,
          date2: date2,
          date3: date3
        }
      })
    }
    return (__app.lodash.gte(date1, date2) && __app.lodash.lt(date1, date3));
  }

  diff(date1, date2, units) {
    date1 += ''
    date2 += ''
    if (!(this.isValid(date1) && this.isValid(date2))) {
      throw new __app.error("date.str.between get invalid date", {
        meta: {
          date1: date1,
          date2: date2
        }
      })
    }
    let jsDate1 = this.getJsDate(date1);
    let jsDate2 = this.getJsDate(date2);
    return __app.math.abs(jsDate1.diff(jsDate2, units));
  }

  daysDiff(date1, date2) {
    return this.diff(date1, date2, "days")
  }
  minutesDiff(date1, date2) {
    return this.diff(date1, date2, "minutes")
  }
  secondsDiff(date1, date2) {
    return this.diff(date1, date2, "seconds")
  }

  add(date1, val, units) {
    date1 += ''
    if (!this.isValid(date1))
      throw new __app.error("str.subtract " + units + " get invalid date", {
        meta: {
          date1: date1
        }
      })
    let jsDate1 = this.getJsDate(date1);
    return jsDate1.add(val, units).format(this.getMask(date1))
  }

  subDays(date1, days) {
    return this.add(date1, -1 * days, "days")
  }

  subMonths(date1, months) {
    return this.add(date1, -1 * months, "months")
  }
  
  subMinutes(date1, minutes) {
    return this.add(date1, -1 * minutes, "minutes")
  }
  
  subSeconds(date1, seconds) {
    return this.add(date1, -1 * seconds, "seconds")
  }

  addMonths(date1, months) {
    return this.add(date1, months, "months")
  }

  addDays(date1, days) {
    return this.add(date1, days, "days")
  }
  addMinutes(date1, minutes) {
    return this.add(date1, minutes, "minutes")
  }
  addSeconds(date1, seconds) {
    return this.add(date1, seconds, "seconds")
  }
}

class Js {
  constructor(options) {
    this.options = options;
  }
  now() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  }
  isValid(d) {}
  between(date1, date2, date3) {}
}

class Pretty {
  constructor(options) {
    this.options = options;
  }
  now() {
    return __app.moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  isValid(d) {

  }
  between(date1, date2, date3) {

  }
}

module.exports = new class Date {
  constructor(options) {
    this.moment = moment;
    this.options = options;
    this.str = new Str();
    this.js = new Js();
    this.pretty = new Pretty();
  }

};
