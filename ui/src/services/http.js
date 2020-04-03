const axios = require("axios");
axios.defaults.baseURL = location.protocol + '//' + location.host + "/api";
import lodash from 'lodash';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import Helpers from './helpers';
let Http = class {
    constructor() {
        this.spinner = null;
    }
    async get(service, params, options = {}) {
        if (options.spin) {
            this.spinner = Helpers.spin(options.spin)
        }
        try {
            let result = await axios.get(service, {
                params: params
            }, options);

            if (result.data)
                return result.data;
        } catch (e) {
            let errorMEssage = lodash.get(error, "response.data.error", "Cannot fetch error from server response")
            if (this.spinner) this.spinner.close();
            throw Error(`post ${service} ${errorMEssage} `)
        }

    }
    async post(service, params, options = {}) {
        if (options.spin) {
            this.spinner = Helpers.spin(options.spin)
        }

        try {
            let result = await axios.post(service, params, options);
            if (this.spinner) this.spinner.close();
            if (result.data)
                return result.data;
            throw new Error("no result data retreived from api")
        } catch (error) {
            let errorMEssage = lodash.get(error, "response.data.error", "Cannot fetch error from server response")
            if (this.spinner) this.spinner.close();
            throw Error(`post ${service} ${errorMEssage} `)
        }

    }

    async put(service, params, options = {}) {
        if (options.spin) {
            this.spinner = Helpers.spin(options.spin)
        }

        try {
            let result = await axios.put(service, params, options);
            if (result.data)
                return result.data;
        } catch (e) {
            let errorMEssage = lodash.get(error, "response.data.error", "Cannot fetch error from server response")
            if (this.spinner) this.spinner.close();
            throw Error(`post ${service} ${errorMEssage} `)
        }
    }
    async delete(service, params, options = {}) {
        if (options.spin) {
            this.spinner = Helpers.spin(options.spin);
        }
        try {
            let result = await axios.delete(service, {
                params: params
            }, options);
            if (result.data)
                return result.data;
        } catch (e) {
            let errorMEssage = lodash.get(error, "response.data.error", "Cannot fetch error from server response")
            if (this.spinner) this.spinner.close();
            throw Error(`post ${service} ${errorMEssage} `)
        }
    }
}
export default new Http();