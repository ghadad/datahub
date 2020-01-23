<template>
  <div v-if="value">
    <target class="rule-section" v-model="value" :entity="entity"></target>
    <origin class="rule-section" v-model="value" :entity="entity"></origin>
    <functions
      title="Transform rules"
      class="rule-section"
      :list.sync="value.transform"
      :functions="functions.transforms"
    ></functions>
    <functions
      title="Validtion rules"
      class="rule-section"
      :list.sync="value.validate"
      :functions="functions.validations"
    ></functions>
    <functions
      title="Drop  rules"
      class="rule-section"
      :list.sync="value.drop"
      :functions="functions.validations"
    ></functions>
    <div class="column is-12">
      <button class="button is-link" @click="update">Update</button>
    </div>
    <div>{{value.drop}}</div>
  </div>
</template>
<script>
import Target from "./target.vue";
import Origin from "./origin.vue";
import Functions from "./functions.vue";

export default {
  name: "csv-collector",
  props: ["value", "functions", "entity"],
  components: { Target, Origin, Functions },
  data: function() {
    return {
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`
    };
  },
  watch: {},
  methods: {
    update() {
      this.$root.$emit("rule-update");
    }
  },
  mounted() {
    //this.value.ruleHandler = this.handlerTemplate;
  }
};
</script>
<style>
.rule-section {
  padding: 7px;
  margin-bottom: 5px;
  background: #eee;
  border-bottom: 1px dotted #ccc;
  border: 1px solid #cdcdcd;
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
</style>