<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="2">
          <router-link :to="{path:'/'}">DATAHUB5</router-link>
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
import Menu from "./config/menu";
let menu = Menu(this.$route);
export default {
  name: "app",
  data: function() {
    return {
      aaa: 1,
      menu: menu
    };
  },
  computed: {
    routes: function() {
      return this.$route;
    }
  }
};
</script>
