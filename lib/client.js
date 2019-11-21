const axios = require("axios");
const xmlParser = require('xml-js');

const toXmlOptions = {
  compact: true,
  ignoreComment: true,
  ignoreDeclaration: false
};

const toJsonOptions = {
  compact: true,
  ignoreDeclaration: true,
  ignoreAttributes: true,
  //nativeType: true
};

class Client {
  constructor(options = {}) {
    this.options = options;
  }

  createRequestBody(service, params) {
    params = params || {};
    this.requestTemplate = __app.config.eai.requestBodyTemplate;
    this.requestTemplate.Request.RequestHeader.ServiceName = service;
    this.requestTemplate.Request.InParams = params;
    __app.logger.debug("requestTemplate:", this.requestTemplate)
    return this.requestTemplate;
  };

  fetchValue(elm) {
    return elm._text;
  }

  fetchPath(elm, path, def = {}) {
    let pathValue = __app.lodash.get(elm, path, def);
    if (__app.lodash.isObject(pathValue) && pathValue._text)
      return pathValue._text;
    return pathValue;
  }

  getXml(service, params) {
    let jsonBody = this.createRequestBody(service, params);
    //sometimes we dont want to display huge amount of sent data ... ( file for example)
    if (this.options.debug !== false)
      __app.logger.debug("callEai " + service + " request", jsonBody);
    let xmlBody = '<?xml version="1.0" encoding="utf-8"?>' + xmlParser.json2xml(jsonBody, toXmlOptions);
    __app.logger.debug("xmlBody:", xmlBody);
    return xmlBody;
  }

  async call(service, params = {}, options = {}) {
    options.timeout = options.timeout || __app.config.eai.timeout;
    options.headers = options.headers || {};
    options.headers['Content-type'] = options['Content-type'] || 'application/xml; charset=utf-8';
    let eaiResult, jsonResult;
    let t1, t2;
    try {
      t1 = __app.ts();
      eaiResult = await axios.post(__app.config.eai.url1, this.getXml(service, params), options);
      t2 = __app.ts();

      __app.logger.debug(
        "callEai " + service + " response (ms:" + (t2 - t1) + ") ",
        eaiResult.data
      );

      jsonResult = xmlParser.xml2js(eaiResult.data, toJsonOptions);
      __app.logger.debug("jsonResult:", jsonResult);
      let EAI_Status = this.fetchPath(jsonResult, "Response.ResponseHeader.EAI_Status");
      __app.logger.debug("EAI_Status:", EAI_Status)
      if (EAI_Status == "0") {
        return this.fetchPath(jsonResult, "Response.OutParams");
      } else {
        throw new __app.error(
          "EAI ERROR", {
            code: "EAI_01",
            level: "CDR",
            meta: jsonResult
          }
        );

      }
    } catch (e) {
      t2 = __app.ts();
      let errorObject = e.stack;
      __app.logger.debug(
        "callEai " + service + " throw Error (ms:" + (t2 - t1) + ") : ",
        errorObject
      );
      throw new __app.error(
        "EAI ERROR", {
          code: "EAI_02",
          level: "CDR",
          meta: errorObject
        }
      );
    }
  };
}



module.exports = new Client();