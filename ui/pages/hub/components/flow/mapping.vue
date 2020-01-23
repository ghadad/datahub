<template>
  <div id="mapping-rules" v-if="$parent.$data.flowData.mapping">
    <div v-if="!$route.query.handler">
      <mapping-rules
        ref="existsRules"
        v-model="$parent.$data.flowData.mapping.config"
        :functions="functions"
        :entity="entity"
      ></mapping-rules>

      <pre>{{$parent.$data.flowData.mapping.config}}</pre>
    </div>
    <div v-if="$route.query.handler">
      <div class="field">
        <label class="label">Post mapping Handler</label>
        <div class="control">
          <codemirror v-model="$parent.$data.flowData.mapping.handler"></codemirror>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MappingRules from "./mapping.rules.vue";

export default {
  name: "mapping",
  components: {
    MappingRules
  },
  data: function() {
    return {
      functions: null,
      route: null,
      entity: {}
    };
  },
  methods: {
    update(rules) {
      this.$set(
        this.$parent.$data.flowData.mapping,
        "config",
        this.$refs.existsRules.rules
      );
      this.$root.$emit("update-project");
    }
  },
  async mounted() {
    let self = this;
    this.$root.$on("rule-update", function() {
      self.update();
    });
    this.functions = await this.$http.get("helpers/functions");
    this.route = this.$route;
    this.entity = this.$parent.$data.entityModel;
  }
};
</script>
