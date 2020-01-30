<template>
  <div v-if="functions">
    <div class="columns">
      <div class="rules-list column is-3">
        <h1 class="strong title is-6 strong" style="direction:ltr">
          Exists rules 
          <span class="clickable" @click="setNewRule(rules.length)"
            title="Add new mapping rule at the endof all existing rules">
            <b-icon class="is-pulled-right clickable" icon="plus-circle" size="is-medium" type="is-info"></b-icon>
          </span>
        </h1>
        <table class="table is-fullwidth is-dark">
          <tr v-show="rules.length==0">
            <th>No exists rules found ... be creative</th>
          </tr>

          <draggable id="rules-table " v-model="cRules" tag="tbody">
            <tr v-for="(rule,index) in cRules" :key="rule.name" class="clickable"
              :class="activeIndex==index?'active':''">
              <td>
                <span class="is-pulled-right" v-show="activeIndex==index">
                  <span class="clickable" @click="setNewRule(index+1)"
                    title="Add new mapping rule after this position !">
                    <b-icon class="is-pulled-right clickable" icon="plus-circle" size="is-small" type="is-dark">
                    </b-icon>
                  </span>
                </span>
              </td>
              <td @click="activeRule=rule;activeIndex=index;newActiveIndex=null">
                {{ rule.name||rule.goTo}}
              </td>
              <td @click="activeRule=rule;activeIndex=index;newActiveIndex=null">{{ index+1 }}</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div class="active-rule column is-9" v-show="newActiveIndex>=0 || activeIndex!==null">
        <div class="columns">
          <div class="column is-2" v-if="activeIndex != null && activeIndex>=0">
            <h2 class="title is-3"> Rule # {{activeIndex +1}}
            </h2>
          </div>
          <div class="column is-4" v-if="newActiveIndex >=0 && newActiveIndex != null">
            <h2 class="title is-3"> New rule at position #{{newActiveIndex}}</h2>
          </div>
          <div class="column is-4">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">short name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input class="input" type="text" placeholder="Short rule description" v-model="activeRule.name" />
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div class="column is-4">
            <div class="is-normal buttons-group ">
              <button class="button is-info" v-show="activeIndex==null" @click="addNewRule">Add to list</button>
              <button class="button is-danger" v-show="activeIndex>=0 && dStep==0" @click="delRule(1)">Delete</button>
              <button class="button is-danger" v-show="activeIndex>=0 && dStep==1" @click="delRule(2)">Are you sure ? </button>
            </div>
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
    components: {
      draggable,
      ruleForm
    },
    data: function () {
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
      activeRule: function () {
        this.$set(this.activeRule, "transform", this.activeRule.transform || []);
        this.$set(this.activeRule, "validate", this.activeRule.validate || []);
        this.$set(this.activeRule, "drop", this.activeRule.drop || []);
      }
    },
    methods: {
      setNewRule(index) {
        this.newActiveIndex = index;
        this.activeIndex = null;
        this.$set(this, "activeRule", {});
      },
      addNewRule() {
        this.rules.splice(this.newActiveIndex,0,this.activeRule)
        this.activeIndex= this.newActiveIndex;
        this.newActiveIndex = null;
      },
      delRule(step) {
        this.dStep = step ;
        if(this.dStep==2){
          this.rules.splice(this.activeIndex,1)
          this.dStep=0;
             this.$set(this, "activeRule", {});
        }


      }
    },
    async mounted() {
      //this.activeIndex = 0;
      this.activeRule = {};
    },
    computed: {
      cRules: {
        get: function () {
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