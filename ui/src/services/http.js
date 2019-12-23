const axios = require("axios");
axios.defaults.baseURL = 'http://localhost:3000/api';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default axios;