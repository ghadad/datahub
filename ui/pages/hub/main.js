import Vue from '@/main'

import sj from 'serialize-javascript';
Vue.prototype.$sj = sj;

function deserialize(serializedJavascript) {
  return eval('(' + serializedJavascript + ')');
}
Vue.prototype.$dj = deserialize;


import App from '@/App.vue'
import router from "./router/";
import Menu from "./config/menu";
import Http from "@/services/http";
Http.get("config").then((response) => {
  window.$serverConfig = response;
  start();
})

function start() {

  new Vue({
    render: function (h) {
      let self = this;
      return h(App, {
        props: {
          menu: self.dmenu,
          title: "Hub"
        }
      })
    },
    computed: {
      dmenu() {
        return Menu(this.$route)
      }
    },
    router,
  }).$mount('#app')
}