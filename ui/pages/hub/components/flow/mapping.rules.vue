<template>
  <div v-if="functions">
    <div class="columns">
      <div class="rules-list column is-3">
        <h1 class="strong title is-6 strong" style="direction:ltr">
          Exists rules
          <span
            class="clickable"
            @click="activeIndex=rules.length"
            title="Add new mapping rule"
          >
            <b-icon
              class="is-pulled-right clickable"
              icon="plus-circle"
              size="is-medium"
              type="is-info"
            ></b-icon>
          </span>
        </h1>
        <table class="table is-fullwidth is-dark">
          <tr v-show="rules.length==0">
            <th>No exists rules found ... be creative</th>
          </tr>

          <draggable id="rules-table " v-model="rules" tag="tbody">
            <tr
              v-for="(rule,index) in rules"
              :key="rule.name"
              class="clickable"
              :class="activeIndex==index?'active':''"
            >
              <td @click="activeRule=rule;activeIndex=index">
                {{ rule.name||rule.goTo}}
                <span class="is-pulled-right" v-show="activeIndex==index">
                  <span
                    class="clickable"
                    @click="setNewRule(index+1,$event)"
                    title="Add new mapping rule"
                  >
                    <b-icon
                      class="is-pulled-right clickable"
                      icon="plus-circle"
                      size="is-small"
                      type="is-dark"
                    ></b-icon>
                  </span>
                </span>
              </td>
              <td>{{ index+1 }}</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div class="active-rule column is-9" v-show="newActiveIndex || activeIndex!==null">
        <div class="field is-horizontal">
          <div class="field-label is-normal has-text-left">
            <label class="label">Rule short name</label>
            {{activeIndex}} {{newActiveIndex}}
          </div>
          <div class="field-body">
            <div class="field has-addons">
              <p class="control">
                <input class="input" type="text" value="me@example.com" v-model="activeRule.name" />
              </p>
            </div>
          </div>

          <div class="is-normal buttons-group">
            <button class="button is-info" v-show="activeIndex==null">Add to list</button>
            <button
              class="button is-danger"
              v-show="activeIndex>=0 && dStep==0"
              @click="delRule(0)"
            >Delete</button>
            <button
              class="button is-danger"
              v-show="activeIndex>=0 && dStep==1"
              @click="delRule(1)"
            >Delete</button>
          </div>
        </div>

        <div class>
          <rule-form v-model="activeRule" :functions="functions" :entity="entity"></rule-form>
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
  props: ["rules", "functions", "entity"],
  components: { draggable, ruleForm },
  data: function() {
    return {
      dStep: 0,
      activeRule: {},
      activeIndex: null,
      newActiveIndex: null,
      route: null,
      flowData: {},
      project: this.$parent.$data.project
    };
  },
  watch: {
    // fullfill function if missing
    activeRule: function() {
      this.$set(this.activeRule, "transform", this.activeRule.transform || []);
      this.$set(this.activeRule, "validate", this.activeRule.validate || []);
      this.$set(this.activeRule, "drop", this.activeRule.drop || []);
    }
  },
  methods: {
    setNewRule(index, e) {
      setTimeout(() => {
        this.newActiveIndex = index + 1;
        this.activeIndex = null;
        this.$set(this, "activeRule", {});
      }, 100);
    },
    addNewRule(index) {},
    delRule(index) {}
  },
  async mounted() {
    //this.activeIndex = 0;
    this.activeRule = {};
  },
  computed: {
    cRules: {
      get: function() {
        return this.$props.rules;
      },
      set(newValue) {
        this.$emit("update:rules", newValue);
      }
    }
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
