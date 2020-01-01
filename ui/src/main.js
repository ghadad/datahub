import Vue from 'vue'

import Lodash from 'lodash';
Vue.prototype.$_ = Lodash;
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

import Http from "@/services/http";
Vue.prototype.$http = Http;

Http.get("config").then(r => window.$serverConfig = r);

export default Vue;