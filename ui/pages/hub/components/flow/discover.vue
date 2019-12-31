<template>
  <div v-if="flowData.collector">
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
  name: "discover",
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
