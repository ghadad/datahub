<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>

    <section>
      <b-steps v-model="activeStep" :animated="true" :has-navigation="false">
        <b-step-item label="flowConfig" :clickable="true"></b-step-item>
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
      breadcrumbs: [
        { name: "projects" },
        { name: "explore", title: this.$route.params.project },
        { title: this.$route.params.flow, active: true }
      ],
      stepRoute: [
        { name: "flowConfig" },
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
    this.$root.$emit("breadcrumbs", this.breadcrumbs);
    let self = this;
    this.route = this.$route;
    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

    this.$root.$on("update-project", async function() {
      let res = await self.$http.put("projects", self.project);
      self.project._rev = res.rev;
    });

    if (this.$route.params.flow) {
      this.flowData = this.project.flows[this.$route.params.flow];
      let targetEntity = this.flowData.collector.config.targetEntity.toLowerCase();
      this.entityModel = this.project.entities[targetEntity] || {};
    } else {
      this.flowData =  await this.$http.get(
      `projects/template/flow`
    );
    }

    this.$router.push({
      name: "flowConfig"
    });
  }
};
</script>