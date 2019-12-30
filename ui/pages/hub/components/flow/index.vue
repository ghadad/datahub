<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>
    <b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message>
    <b-message
      title="collector.config"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.collector.config}}</b-message>
    <b-message
      title="collector.handler"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.collector.handler}}</b-message>

    <b-message
      title="mapping.config"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.mapping.config}}</b-message>
    <b-message
      title="mapping.handler"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.mapping.handler}}</b-message>
    <b-message
      title="discover.config"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.discover.config}}</b-message>
    <b-message
      title="discover.handler"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.discover.handler}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "flow",
  data: function() {
    return {
      flowData: {}
    };
  },

  async mounted() {
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );
    this.flowData = project.flows[this.$route.params.flow];
  }
};
</script>
