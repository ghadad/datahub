import Vue from 'vue'


import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

import Http from "@/services/http";
Vue.prototype.$http = Http;

export default Vue;