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
    <section>
      <b-steps v-model="activeStep" :animated="true" :has-navigation="false">
        <b-step-item label="Collector" :clickable="true"></b-step-item>
        <b-step-item label="Handler" :clickable="true"></b-step-item>
        <b-step-item label="Mapping" :clickable="true"></b-step-item>
        <b-step-item label="Handler" :clickable="true"></b-step-item>
        <b-step-item label="Discover" :clickable="true"></b-step-item>
      </b-steps>
    </section>

    <router-view></router-view>
    <b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message>
  </div>
</template>
<script>
export default {
  name: "flow",
  data: function() {
    return {
      stepRoute: [
        { name: "collector" },
        { name: "collector", query: { handler: true } },
        { name: "mapping" },
        { name: "mapping", query: { handler: true } },
        { name: "discover" }
      ],
      activeStep: 0,
      project: null,
      flowData: {},
      entityModel: {},
      route: null
    };
  },
  watch: {
    activeStep: function(newVal) {
      //alert(newVal);
      this.$router.push(this.stepRoute[newVal]);
    }
  },
  async mounted() {
    let self = this;
    this.route = this.$route;
    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

    this.$root.$on("update-project", async function() {
      let res = await self.$http.put("projects", self.project);
      self.project._rev = res.rev;
    });

    this.flowData = this.project.flows[this.$route.params.flow];
    let targetEntity = this.flowData.collector.config.targetEntity.toLowerCase();
    this.entityModel = this.project.entities[targetEntity];
    this.$router.push({
      name: "collector"
    });
  }
};
</script>