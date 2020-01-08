<template>
  <div>
    <h1>Maping rules</h1>
    <div class="columns">
      <div class="rules-list column is-3">
        <table class="table is-fullwidth is-dark">
          <draggable v-model="rules" tag="tbody">
            <tr v-for="(rule,index) in rules" :key="rule.name" :class="activeIndex==index?'active':''">
              <td>{{ index+1 }}</td>
              <td @click="activeRule=rule;activeIndex=index">{{ rule.name||rule.goTo}}</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div class="active-rule column is-9">
      <div class="">
      <rule-form v-model="activeRule" :functions="functions"></rule-form>
      {{activeRule}}
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ruleForm from "./rule.form.vue";

  export default {
    name: "MappingRules",
    props: ["value", "functions"],
      components: { draggable ,ruleForm},
    data: function () {
      return {
        rules:this.value,
        activeRule:null,
        activeIndex:null,
        route: null,
        flowData: {}
      };
    },
    async mounted() {}
  };
</script>
<style scoped>
.rules-list {max-height:500px;overflow:auto;direction:rtl}
tr.active {background:#CCC}
</style>