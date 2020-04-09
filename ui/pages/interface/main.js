import Vue from '@/main'


import App from '@/App.vue'
import router from "./router/";
import Menu from "./config/menu";
import Http from "@/services/http";

function start() {

  new Vue({
    render: h => h(App, {
      props: {
        menu: Menu,
        title: "Interfaces"
      }
    }),
    data: {
      serverCofig: {}
    },
    router,
  }).$mount('#app')
}

Http.get("config").then((response) => {
  Vue.prototype.$serverConfig = response;
  start();
})