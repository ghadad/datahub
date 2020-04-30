import Vue from '@/main'
import Http from "@/services/http";


import App from '@/App.vue'
import router from "./router/";
import Menu from "./config/menu";

function start(conf) {
  new Vue({
    render: h => h(App, {
      props: {
        menu: Menu,
        title: "Admin"
      }
    }),
    data: {
      sysConfig: conf
    },
    router,
  }).$mount('#app')
}

Http.get("config").then((response) => {
  Vue.prototype.$sysConfig = response;
  start(response);
})