<template>
  <div id="app">
     <top-menu />
    <img alt="Vue logo" src="./assets/logo.png">
    <left-menu></left-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import leftMenu from '@/components/leftmenu.vue';
import topMenu from '@/components/topMenu.vue';

export default {
  name: 'app',
  components:{
    leftMenu,
    topMenu,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
