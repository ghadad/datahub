import Vue from 'vue'

import Lodash from 'lodash';
Vue.prototype.$_ = Lodash;
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy, {
    defaultIconPack: 'fas',
})

import Http from "@/services/http";
Vue.prototype.$http = Http;

import ValidationProvider from "./validate.js";
Vue.component('ValidationProvider', ValidationProvider);

Http.get("config").then(r => window.$serverConfig = r);

export default Vue;