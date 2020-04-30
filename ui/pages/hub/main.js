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


function start(conf) {
  new Vue({
    render: function (h) {
      let self = this;
      return h(App, {
        props: {
          menu: self.dmenu,
          title: "Interfaces"
        }
      })
    }, data: {
      sysConfig: conf
    },
    computed: {
      dmenu() {
        return Menu(this.$route)
      }
    },
    router,

  }).$mount('#app')
}

Http.get("config").then((response) => {
  Vue.prototype.$sysConfig = response;
  start(response);
})
