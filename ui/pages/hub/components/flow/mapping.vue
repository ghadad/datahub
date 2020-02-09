<template>
  <div id="mapping-rules" v-if="$parent.$data.flowData.mapping">
    <div v-if="!showHandler">
    <h1 class="title">Collector settings <b-button class="button is-info is-pulled-right" icon-right="code"  @click="showHandler=true">Mapping post handler</b-button></h1>
      <mapping-rules
        ref="existsRules"
        :rules.sync="$parent.$data.flowData.mapping.config"
        :functions="functions"
        :entity="entity"
        :collector="$parent.$data.flowData.collector.config"
      ></mapping-rules>
    </div>
    <div v-if="showHandler">
       <h1 class="title">Collector settings <b-button class="button is-info is-pulled-right" icon-right="code"  @click="showHandler=false">Mapping rules</b-button></h1>

      <div class="field">
        <label class="label">Post mapping Handler</label>
        <div class="control">
          <codemirror v-model="$parent.$data.flowData.mapping.handler"></codemirror>
          <button class="button is-link" @click="update">Update</button>
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
      showHandler:false,
      functions: null,
      route: null,
      entity: {},
      project: this.$parent.$data.project
    };
  },
  methods: {
    async update() {
      await this.$saveProject(this.project);
    }
  },
  async mounted() {
    let self = this;
    this.functions = await this.$http.get("helpers/functions");
    this.route = this.$route;
    this.entity = this.$parent.$data.entityModel;
  }
};
</script>
