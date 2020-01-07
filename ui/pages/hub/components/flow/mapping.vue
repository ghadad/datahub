<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>
    <b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message>
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
<pre>{{functions}}</pre>
  </div>
</template> 
<script>
export default {
  name: "mapping",
  data: function() {
    return {
      functions:null,
      route:null,
      flowData: {} 
    };
  },

  async mounted() {
    this.functions = await this.$http.get("helpers/functions");;
    this.route = this.$route;
      this.flowData = this.$parent.$data.flowData ;
  }
};
</script>
