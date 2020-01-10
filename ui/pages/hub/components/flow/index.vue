<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#">Bulma</a>
        </li>
        <li>
          <a href="#">Documentation</a>
        </li>
        <li>
          <a href="#">Components</a>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">Breadcrumb</a>
        </li>
      </ul>
    </nav>
    <div class="tabs">
      <ul>
        <li class="is-active">
          <router-link :to="{name:'collector'}">Collector</router-link>
        </li>
        <li>
          <router-link :to="{name:'mapping'}">Mapping</router-link>
        </li>
        <li>
          <router-link :to="{name:'discover'}">Discover</router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
    <b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message>
  </div>
</template>
<script>
export default {
  name: "flow",
  data: function() {
    return {
      flowData: {},
      entityModel: {},
      route: null
    };
  },

  async mounted() {
    this.route = this.$route;
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );
    this.flowData = project.flows[this.$route.params.flow];
    let targetEntity = this.flowData.collector.config.targetEntity.toLowerCase();
    this.entityModel = project.entities[targetEntity];
    this.$router.push({
      name: "collector"
    });
  }
};
</script>