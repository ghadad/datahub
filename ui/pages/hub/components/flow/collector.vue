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

  </div>
</template> 
<script>
export default {
  name: "collector",
  data: function() {
    return {
      flowData: {} 
    };
  },

  async mounted() {
      this.flowData = this.$parent.$data.flowData ;
  }
};
</script>
