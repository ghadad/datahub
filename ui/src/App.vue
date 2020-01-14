<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-2 has-background-white-ter">
        <aside class="menu">
          <div class="menu-label">
            <h1 class="side-title tag is-dark is-large has-text-center title">
              <div class="columns">
                <div class="column is-9">DATAHUB5 {{$props.title}}</div>
                <div class="column is-3">
                  <b-notification
                    style="background:none;position:fixed;margin-top:-20px"
                    :active.sync="globalOk"
                    type="is-clear"
                    auto-close="2"
                    :closable="false"
                  >
                    <b-tag rounded v-show="globalOk" class="is-success">:)</b-tag>
                  </b-notification>
                </div>
              </div>
            </h1>
          </div>
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
          <p class="menu-label is-4 title"></p>
          <ul class="menu-list">
            <li>
              <p class="menu-label is-5 title">DASHBOARDS</p>
            </li>
            <li>
              <a href="admin">Admin</a>
            </li>
            <li>
              <a href="hub">HUB</a>
            </li>
            <li>
              <a href="interfaces">Interfaces</a>
            </li>
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
        </aside>
      </div>
      <sction></sction>
      <div class="column">
        <h1 class="main-title title">
          {{routeTitle}}
          <b-tag
            type="is-primary"
            size="is-medium"
            v-for="(v,p) in routeParams"
            :key="p"
          >{{p}}:{{v}}</b-tag>
        </h1>
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
      globalOk: null,
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
    let self = this;
    this.$root.$on("global-ok", function(data) {
      self.globalOk = data;
    });
    this.serverConfig = await this.$http.get("config");
  },
  computed: {
    routeTitle: function() {
      let str = this.$route.meta.title || this.$route.path;
      return str.replace("/", "");
    },
    routeParams: function() {
      if (this.$route.params.pathMatch) return {};
      return this.$route.params;
    },

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
h1.title {
}
.main-title .tag {
  margin-left: 50px;
  margin-left: 10px;
}
.side-title {
  width: 100%;
}
</style>

