<template>
  <div v-if="value">
    <target class="rule-section" v-model="value" :entity="entityData" :collapse="collapse"></target>
    <origin class="rule-section" v-model="value" :entity="entityData" :collapse="collapse"></origin>
    <div class="buttons rules-buttons-group">
      <b-button
        :type="cloneRule.hasTransform ? 'is-light':'is-info'"
        @click="cloneRule.hasTransform = !cloneRule.hasTransform"
        class="is-small"
      >{{cloneRule.hasTransform ? 'Disable transforms':'Enable transforms'}}</b-button>
      <b-button
        :type="cloneRule.hasValidation ? 'is-light':'is-info'"
        @click="cloneRule.hasValidation = !cloneRule.hasValidation"
        class="is-small"
      >{{cloneRule.hasValidation ? 'Disable validations':'Enable validations'}}</b-button>
      <b-button
        :type="cloneRule.hasDrop ? 'is-light':'is-info'"
        @click="cloneRule.hasDrop = !cloneRule.hasDrop"
        class="is-small"
      >{{cloneRule.hasDrop ? 'Disable drops':'Enable drops'}}</b-button>
    </div>
    <functions
      v-if="cloneRule.hasTransform"
      title="Transform rules"
      class="rule-section"
      :list.sync="cloneRule.transform"
      :functions="functions.transforms"
      op="->"
      :collapse="collapse"
    ></functions>
    <functions
      v-if="cloneRule.hasValidation"
      title="Validtion rules"
      class="rule-section"
      :list.sync="cloneRule.validate"
      :functions="functions.validations"
      op="and"
      :collapse="collapse"
    ></functions>
    <functions
      v-if="cloneRule.hasDrop"
      title="Drop  rules"
      class="rule-section"
      :list.sync="cloneRule.drop"
      :functions="functions.validations"
      op="or"
      :collapse="collapse"
    ></functions>
  </div>
</template>
<script>
import Target from "./target.vue";
import Origin from "./origin.vue";
import Functions from "./functions.vue";

export default {
  name: "rule-form",
  props: ["value", "functions", "entity", "collapse", "rules", "ruleIndex"],
  components: { Target, Origin, Functions },
  data: function() {
    return {
      flowData: this.$parent.$data.project.flows[this.$route.params.flow],
      entityData: {},
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`
    };
  },
  watch: {},
  methods: {},
  mounted() {
    //this.value.ruleHandler = this.handlerTemplate;
    if (this.flowData.config.targetEntity)
      this.entityData = this.$parent.$data.project.entities[
        this.flowData.config.targetEntity
      ];
    else this.entityData = {};
  },
  computed: {
    cloneRule: {
      get(newVal) {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>
<style>
.rule-section {
  padding: 7px;
  margin-bottom: 5px;
  background: #efefefb3;
  border-bottom: 1px dotted #ccc;
  border: 2px solid #aaa;
  border-radius: 3px;
}
.tag-head {
  position: relative;
  top: -8px;
  left: -8px;
  border-radius: 3px;
}
.sub-tag-head {
  margin-top: 15px;
  margin-left: 10px;
}
.tag-head .tag {
  border-radius: 2px;
}
is-7 {
  font-size: 1.2em;
}
.buttons.rules-buttons-group {
  margin-bottom: 1px !important;
}
.rules-buttons-group .is-light {
  border: 1px solid #ccc;
  font-weight: 600;
}
</style>
<style>
</style>