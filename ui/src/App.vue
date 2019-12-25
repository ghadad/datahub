<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-2">
        <aside class="menu">
          <p class="menu-label">
            <router-link :to="{path:'/'}">DATAHUB5</router-link>
          </p>
          <ul class="menu-list">
            <li v-for="(mItem,index) in menu.leftMenu" :key="index">
              <router-link :to="mItem.routerLink">{{mItem.title}}</router-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["menu"],
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
