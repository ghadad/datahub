import Vue from 'vue'
alert('in admin');

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(VueMaterial)
import App from './App.vue'
Vue.config.productionTip = false
import router from   "@/core/router";
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
