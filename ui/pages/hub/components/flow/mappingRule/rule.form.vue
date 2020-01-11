<template>
  <div v-if="value">
    <h1>Rule setup</h1>
    <target class="rule-section" v-model="value" :entity="entity"></target>
    <origin class="rule-section" v-model="value" :entity="entity"></origin>
    <transform class="rule-section" v-model="value" :functions="functions"></transform>
    <validation class="rule-section" v-model="value" :functions="functions"></validation>
    <drop v-model="value" :functions="functions"></drop>
  </div>
</template>
<script>
import Target from "./target.vue";
import Origin from "./origin.vue";
import Transform from "./transform.vue";
import Validation from "./validation.vue";
import Drop from "./drop.vue";

export default {
  name: "csv-collector",
  props: ["value", "functions", "entity"],
  components: { Target,Origin,Transform,Validation ,Drop},
  data: function() {
    return {
      activeDrop: {},

      activeValdation: {},
      activeTransformation: {},
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`
    };
  },
  watch: {
 
  },
  mounted() {
    //this.value.ruleHandler = this.handlerTemplate;
  }
};
</script>
<style>
.rule-section {padding:20px  0 20px 0 ;border-bottom:1px dotted #CCC}
</style>