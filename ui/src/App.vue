<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="2"><router-link :to="{path:'/'}"> DATAHUB5</router-link>
        </md-toolbar>
        <md-list>
          <md-list-item v-for="(mItem,index) in menu.leftMenu" :key="index">
            <md-icon>{{mItem.icon}}</md-icon>
            <span class="md-list-item-text">
              <router-link :to="mItem.routerLink">{{mItem.title}}</router-link>
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

export default {
  name: "app",
  props:["menu"],
  data: function() {
    return {
      menu1: {}
    };
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
