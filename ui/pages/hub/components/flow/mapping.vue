<template>
  <div v-if="$parent.$data.flowData.collector">
    <mapping-rules ref="mappingRules"  v-model="$parent.$data.flowData.mapping.config" :functions="functions" :entity="entity"></mapping-rules>
      <button class="button is-link" @click="update">Update</button>

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
      entity: {}
    };
  },
methods:{
  update(rules) { 
      this.$set(this.$parent.$data.flowData.mapping,'config',this.$refs.mappingRules.rules);
      this.$root.$emit("update-project");
  }
},
  async mounted() {
    this.functions = await this.$http.get("helpers/functions");
    this.route = this.$route;
    this.entity = this.$parent.$data.entityModel;
  }
};
</script>
