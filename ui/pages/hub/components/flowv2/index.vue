<template>
  <div v-if="flowData.collector">
    <section>
      <b-tabs v-model="activeStep" :animated="true" :has-navigation="false">
        <b-tab-item icon="info" label="flowConfig" :clickable="true"></b-tab-item>
        <b-tab-item icon="download" label="Collector" :disabled="flowData.config.name? false:true"></b-tab-item>
        <b-tab-item icon="cog" label="Test station" :disabled="flowData.config.name? false:true"></b-tab-item>
        <b-tab-item icon="adjust" label="Mapping" :disabled="flowData.config.name? false:true"></b-tab-item>
        <b-tab-item icon="cog" label="Test station" :disabled="flowData.config.name? false:true"></b-tab-item>
        <b-tab-item
          icon="check-square"
          label="Finalize"
          :disabled="flowData.config.name? false:true"
        ></b-tab-item>
      </b-tabs>
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
      targetEntity: "",
      breadcrumbs: [
        { name: "projects" },
        { name: "explore", title: this.$route.params.project },
        { title: this.$route.params.flow, active: true }
      ],
      stepRoute: [
        { name: "flowConfig" },
        { name: "collector" },
        { name: "tester_collector", params: { tester: "collector" } },
        { name: "mapping" },
        { name: "tester_mapping", params: { tester: "mapping" } },
        { name: "finalize" }
      ],
      activeStep: null,
      project: null,
      flowData: {},
      entityModel: {},
      route: null
    };
  },
  watch: {
    "flowData.config.targetEntity": function(newVal) {
      let self = this;
      self.$set(
        self,
        "entityModel",
        self.project.entities[self.targetEntity] || {}
      );
    },
    "$route.name": function(newVal) {
      this.activeStep = this.stepRoute.findIndex(e => e.name == newVal);
    },
    activeStep: function(newVal) {
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

    if (self.$route.params.flow) {
      this.flowData = this.$_.find(
        self.project.flows,
        e => e.config.name == this.$route.params.flow
      );

      if (self.flowData.config.targetEntity)
        self.targetEntity = self.flowData.config.targetEntity.toLowerCase();
      self.$set(
        self,
        "entityModel",
        self.project.entities[self.targetEntity] || {}
      );
    } else {
      self.flowData = await self.$http.get(`projects/template/flow`);
    }
  }
};
</script>
<style>
.b-steps .steps + .step-content {
  padding: 13px;
}
.tabs li.is-active {
  border-bottom: 2px solid #0066ffa3;
}
.tabs li.is-active a {
  border: 0;
  font-weight: bolder;
  color: #000000c7;
}
</style>
