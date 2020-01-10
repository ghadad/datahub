<template>
  <div v-if="flowData.collector">
    <mapping-rules v-model="flowData.mapping.config" :functions="functions" :entity="entity"></mapping-rules>
    <div class="columns">
      <div class="column is-2">flowData.mapping :{{flowData.mapping}}</div>
      <div class="column is-3">
        <h3 class="title">transforms:</h3>
        {{functions.transforms}}
      </div>
      <div class="column is-6">
        <h3 class="title">validations:</h3>
        {{functions.validations}}
      </div>
    </div>
  </div>
</template> 
<script>
import MappingRules from "./mapping.rules.vue";
export default {
  name: "mapping",
  components: { MappingRules },
  data: function() {
    return {
      functions: null,
      route: null,
      flowData: {},
      entity: {}
    };
  },

  async mounted() {
    this.functions = await this.$http.get("helpers/functions");
    this.route = this.$route;
    this.flowData = this.$parent.$data.flowData;
    this.entity = this.$parent.$data.entityModel;
  }
};
</script>
