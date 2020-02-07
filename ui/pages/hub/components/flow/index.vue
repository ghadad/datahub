<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>

    <section>
      <b-steps v-model="activeStep" :animated="true" :has-navigation="false">
        <b-step-item  icon="info"  label="flowConfig" :clickable="true"></b-step-item>
        <b-step-item  icon="download" label="Collector" :clickable="flowData.config.name? true:false"></b-step-item>
        <b-step-item  icon="cog" label="Test station" :clickable="flowData.config.name? true:false"></b-step-item>
        <b-step-item  icon="adjust" label="Mapping" :clickable="flowData.config.name? true:false"></b-step-item>
        <b-step-item  icon="cog"  label="Test station" :clickable="flowData.config.name? true:false"></b-step-item>
        <b-step-item icon="check-square" label="Discover" :clickable="flowData.config.name? true:false"></b-step-item>
      </b-steps>
    </section>
    <router-view></router-view>
    <!--b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message-->
  </div>
</template>
<script>
export default {
  name: "flow",
  data: function() {
    return {
      breadcrumbs: [
        { name: "projects" },
        { name: "explore", title: this.$route.params.project },
        { title: this.$route.params.flow, active: true }
      ],
      stepRoute: [
        { name: "flowConfig" },
        { name: "collector" },
        { name: "tester", params: { tester: "collector" } },
        { name: "mapping" },
        { name: "tester", params: { tester: "mapping" } },
        { name: "discover" }
      ],
      activeStep: null,
      project: null,
      flowData: {},
      entityModel: {},
      route: null
    };
  },
  watch: {
    "$route.name": function(newVal) {
      this.activeStep = this.stepRoute.findIndex(e => e.name == newVal);
    },
    activeStep: function(newVal) {
      //alert(newVal);
      this.$router.push(this.stepRoute[newVal]);
    }
  },
  async mounted() {
    this.activeStep =
      this.stepRoute.findIndex(e => e.name == this.$route.name) || 0;
    if (this.activeStep < 0) this.activeStep = 0;
    this.$root.$emit("breadcrumbs", this.breadcrumbs);
    let self = this;
    this.route = this.$route;
    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

    self.$root.$on("update-project", async function(routeParams = {}) {
      let res = await self.$http.put("projects", self.project);
      self.$set(self.project, "_rev", res.rev);
      self.$root.$emit("global-ok", res.ok || false);
      if (routeParams.name) self.$router.push(routeParams);
    });

    if (self.$route.params.flow) {
      this.flowData = this.project.flows[this.$route.params.flow];
      let targetEntity = this.flowData.collector.config.targetEntity.toLowerCase();
      this.$set(this, "entityModel", this.project.entities[targetEntity] || {});
    } else {
      this.flowData = await this.$http.get(`projects/template/flow`);
    }
  }
};
</script>