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
        
    }
    async post(service, params, options) {
        let result = await axios.post(service, params, options);
        if (result.data)
            return result.data;
        
    }
    async put(service, params, options) {
        let result = await axios.put(service, params, options);
        if (result.data)
            return result.data;
       
    }
    async delete(service, params, options) {
        let result = await axios.delete(service, {
            params: params
        }, options);
        if (result.data)
            return result.data;
    }
}
export default new Http();