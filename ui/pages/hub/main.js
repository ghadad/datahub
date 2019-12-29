import Vue from '@/main'


import App from '@/App.vue'
import router from "./router/";
import Menu from "./config/menu";

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