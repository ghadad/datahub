<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-2">
        <aside class="menu">
          <p class="menu-label">
            <router-link :to="{path:'/'}">DATAHUB5 {{$props.title}}</router-link>
          </p>
          <ul class="menu-list">
            <li v-for="(mItem,index) in menu.leftMenu" :key="index">
              <router-link :to="mItem.routerLink">{{mItem.title}}</router-link>
              <ul v-if="mItem.children && mItem.children.length" class="menu-list">
                <li v-for="(sm,index) in mItem.children" :key="index">
                  <router-link :to="sm.routerLink">{{sm.title}}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <div v-if="globalError">
          <b-notification
            :active.sync="globalError.err"
            type="is-danger"
            aria-close-label="Close notification"
            role="alert"
            auto-close="5"
          >
            <h1 class="h1 title">Error</h1>
            <p>{{globalError.err}}</p>
            <p>{{globalError.component}}</p>
            <p>{{globalError.info}}</p>
          </b-notification>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["menu", "title"],
  data: function() {
    return {
      globalError: null,
      menu1: {},
      serverConfig: null
    };
  },
  errorCaptured(err, vm, info) {
    this.$set(this, "globalError", {
      err: err.toString(),
      component: vm.$options.name,
      info: info
    });
  },
  async mounted() {
    this.serverConfig = await this.$http.get("config");
  },
  computed: {
    routes: function() {
      return this.$route;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

md-tabs.md-no-animation md-tab-content {
  transition: none;
}
.md-drawer {
  width: 200px !important;
}
</style>
