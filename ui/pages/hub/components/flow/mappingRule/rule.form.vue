<template>
  <div>
    <h1>Rule setup</h1>
    <target v-model="value" :entity="entity"></target>
    <origin v-model="value" :entity="entity"></origin>
    <transform v-model="value" :functions="functions"></transform>
    <validation class="has-background-info is-background-info" v-model="value" :functions="functions"></validation>
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
    keyType: function(newVal, oldVal) {
      if (newVal == "pkHandler") this.value.pkHandler = this.handlerTemplate;
    }
  },
  async mounted() {
    this.value.ruleHandler = this.handlerTemplate;
  }
};
</script>