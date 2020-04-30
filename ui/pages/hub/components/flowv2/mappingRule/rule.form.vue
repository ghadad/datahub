<template>
  <div v-if="value">
    <target class="rule-section" v-model="value" :entity="entityData" :collapse="collapse"></target>
    <origin class="rule-section" v-model="value" :entity="entityData" :collapse="collapse"></origin>
    <div class="rules-checkbox-group">
      <b-checkbox v-model="cloneRule.hasTransform" type="is-info">Add transforms</b-checkbox>
      <b-checkbox v-model="cloneRule.hasValidation" type="is-info">Add validations</b-checkbox>
      <b-checkbox v-model="cloneRule.hasDrop" type="is-info">Add Drops</b-checkbox>
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
      flowData: this.$parent.$data.project.flows.find(
        f => f.config.name == this.$route.params.flow
      ),
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
      get() {
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
.rules-checkbox-group .checkbox {
  margin-bottom: 5px !important;
  font-weight: 700;
  margin-right: 30px;
}
</style>
<style>
</style>