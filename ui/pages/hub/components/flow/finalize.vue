<template>
  <div v-if="flowData.collector">
    <b-message
      title="flowData.finalize.config"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.finalize.config}}</b-message>
    <b-message
      title="finalize.handler"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.finalize.handler}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "finalize",
  data: function() {
    return {
      flowData: {}
    };
  },

  async mounted() {
    this.flowData = this.$parent.$data.flowData;
  }
};
</script>
