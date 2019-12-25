const axios = require("axios");
axios.defaults.baseURL = 'http://localhost:3000/api';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let Http = class {
    constructor() {

    }
    async get(service, params, options) {
        let result = await axios.get(service, {
            params: params
        }, options);
        if (result.data)
            return result.data;
        __app.logger.error("bad http response :", result)
    }
    async post(service, params, options) {
        let result = await axios.post(service, params, options);
        if (result.data)
            return result.data;
        __app.logger.error("bad http response :", result)
    }
    async put(service, params, options) {
        let result = await axios.put(service, params, options);
        if (result.data)
            return result.data;
        __app.logger.error("bad http response :", result)
    }
    async delete(service, params, options) {
        let result = await axios.delete(service, {
            params: params
        }, options);
        if (result.data)
            return result.data;
        __app.logger.error("bad http response :", result)
    }
}
export default new Http();