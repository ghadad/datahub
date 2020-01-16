<template>
  <div v-if="functions">
    <div class="columns">
      <div class="rules-list column is-3">
        <h1 class="strong title is-6 has-text-left strong">Exists rules</h1>
        <table class="table is-fullwidth is-dark">
          <draggable id="rules-table" v-model="rules" tag="tbody">
            <tr
              v-for="(rule,index) in rules"
              :key="rule.name"
              :class="activeIndex==index?'active':''"
            >
              <td @click="activeRule=rule;activeIndex=index">{{ rule.name||rule.goTo}}</td>
              <td>{{ index+1 }}</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div class="active-rule column is-9">
        <h1 class="strong is-6 has-text-left title strong">
          Rule config :{{activeRule.name || activeRule.goTo}}
          <b-icon icon="account" size="is-small"></b-icon>
        </h1>

        <div class>
          <rule-form v-model="activeRule" :functions="functions" :entity="entity"></rule-form>
          {{activeRule}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ruleForm from "./mappingRule/rule.form.vue";

export default {
  name: "MappingRules",
  props: ["value", "functions", "entity"],
  components: { draggable, ruleForm },
  data: function() {
    return {
      rules: this.$_.cloneDeep(this.$props.value),
      activeRule: {},
      activeIndex: null,
      route: null,
      flowData: {}
    };
  },
  async mounted() {
    this.activeIndex = 0;
    this.activeRule = this.rules[0];
  }
};
</script>
<style scoped>
.rhead {
  border: 1px solid #ccc;
}
.rules-list {
  max-height: 500px;
  overflow: auto;
  direction: rtl;
}
tr.active {
  font-weight: bolder;
  background: #ccc;
}
#rules-table td {
  padding: 2px;
  border: 1px solid #cdcdcd;
  cursor: pointer;
}
.strong {
  font-weight: bolder;
}
</style>