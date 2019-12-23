import Vue from '@/main'


import App from '@/App.vue'
import router from "./router/";
import Menu from "./config/menu";
new Vue({
  render: h => h(App, {
    props: {
      menu: Menu
    }
  }),
  router,
}).$mount('#app')