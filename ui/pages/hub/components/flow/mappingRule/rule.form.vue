<template>
  <div>
    <h1>Rule setup</h1>
    <target v-model="value" :entity="entity"></target>
  </div>
</template>
<script>
import Target from "./target.vue";
export default {
  name: "csv-collector",
  props: ["value", "functions", "entity"],
  components: { Target },
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