
<template>
  <div class="page-container">
    <md-app>
    <top-menu />
    
      <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
      </md-app-toolbar>
        <md-app-drawer md-permanent="full">

        <md-toolbar class="md-transparent" md-elevation="2">
           Navigation
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Projects</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Jobs</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Scheduler</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Docs</span>
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
  import leftMenu from '@/components/leftmenu.vue';
  import topMenu from '@/components/topMenu.vue';

  export default {
    name: 'app',
    components: {
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