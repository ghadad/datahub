<template>
  <div class="container is-fluid full-height main-layout">
    <div class="columns full-height">
      <div class="column is-2 has-background-white-ter full-height menu-container">
        <aside class="menu">
          <div class="menu-label">
            <h1 class="has-text-centered has-background-dark has-text-white logo title is-4">
              <b-notification
                style="background:none;position:fixed;left:0px;top:1px"
                :active.sync="globalOk"
                type="is-clear"
                :auto-close="true"
                :closable="false"
              >
                <b-icon icon="check-circle" v-show="globalOk" type="is-success">:)</b-icon>
              </b-notification>

              DATAHUB5 {{$props.title}}
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
      <div class="column">
        <h1 class="main-title title" v-if="$route.name!='home'">
          {{$route.meta.title|| $route.name||$route.path}}
          <b-tag type="is-info" size="is-medium" v-for="(v,p) in routeParams" :key="p">{{p}}:{{v}}</b-tag>
        </h1>
        <div v-if="globalError">
          <b-notification
            :active.sync="globalError.err"
            type="is-danger"
            aria-close-label="Close notification"
            role="alert"
            :auto-close="true"
          >
            <h1 class="h1 title">Error</h1>
            <p>{{globalError.err}}</p>
            <p>{{globalError.component}}</p>
            <p>{{globalError.info}}</p>
          </b-notification>
        </div>
        <breadcrumb class="breadcrumb-container"></breadcrumb>
        <router-view class="main-view"></router-view>
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
html,
body {
  height: 100%;
}

.main-title {
  padding-top: 30px;
  padding-left: 30px;
}
.main-title .tag {
  margin-right: 10px;
  border: 1px solid black;
}
.breadcrumb-container {
  margin-left: 30px;
}
.clickable {
  cursor: pointer;
}

.entry-page {
  height: 100%;
  padding-top: 30px;
}
.icon.clickable,
.icon.clickable svg {
  pointer-events: initial !important;
  cursor: pointer;
}
.buttons-group .button {
  margin-right: 5px;
}
.full-height {
  height: 100%;
}
.main-layout > .column {
  padding: 0rem !important;
}
.menu {
  padding-left: 24px;
  padding-top: 20px;
}
.container.is-fluid {
  margin: 0 !important;
  /* margin-right: 32px; */
  max-width: none;
}
.logo {
  padding: 7px;
  margin: 5px;
}
.main-view {
  padding-left: 25px;
  padding-right:20px
}
.CodeMirror {
  height: 100%;
}
</style>

