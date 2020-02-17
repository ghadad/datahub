<template>
  <div v-if="functions">
    <div class="columns">
      <div class="rules-list column is-3">
        <h1 class="strong title is-6 strong" style="direction:ltr">
          Exists rules
          <span
            class="clickable"
            @click="setNewRule(rules.length)"
            title="Add new mapping rule at the endof all existing rules"
          >
            <b-icon
              class="is-pulled-right clickable"
              icon="plus-circle"
              size="is-medium"
              type="is-info"
            ></b-icon>
          </span>
        </h1>
        <table id="mapping-rules" class="table is-fullwidth is-dark">
          <tr v-show="rules.length==0">
            <th>No exists rules found ... be creative</th>
          </tr>
          <tr v-show="rules.length==0">
            <th class="has-text-centered">
              <button
                class="button is-primary is-large"
                @click="displayFastAssign()"
              >Fast assignments mapping</button>
            </th>
          </tr>
          <draggable v-model="cRules" tag="tbody">
            <tr
              v-for="(rule,index) in cRules"
              :key="rule.name"
              class="clickable"
              :class="activeIndex==index?'active':''"
            >
              <td>
                <span class="is-pulled-right" v-show="activeIndex==index">
                  <span
                    class="clickable"
                    @click="setNewRule(index+1)"
                    title="Add new mapping rule after this position !"
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
              <td
                @click="setRule(rule);activeIndex=index;newActiveIndex=null"
              >{{rule.name||rule.goTo}}</td>
              <td @click="setRule(rule);activeIndex=index;newActiveIndex=null">{{ index+1 }}</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div v-show="cRules.length==0 && fastAssignment" class="column is-9">
        <fast-mapping :rules.sync="cRules" :entity="entity" :collector="collector"></fast-mapping>
      </div>
      <div
        class="active-rule column is-9"
        v-if="newActiveIndex || activeIndex || activeIndex===0 || newActiveIndex===0"
      >
        <div class="columns">
          <div v-if="1">newActiveIndex:{{newActiveIndex}} ,activeIndex:{{activeIndex}}</div>
          <div class="column is-2" v-if="activeIndex != null && activeIndex>=0">
            <h2 class="title is-3">Rule # {{activeIndex +1}}</h2>
          </div>
          <div class="column is-4" v-if="newActiveIndex >=0 && newActiveIndex != null">
            <h2 class="title is-3">New rule at position #{{newActiveIndex}}</h2>
          </div>
          <div class="column is-4">
            <div class="field is-horizontal">
              <div class="field-label">
                <label class="label">short name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Short rule description"
                      v-model="activeRule.name"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-3">
            <div class="is-normal buttons-group">
              <button
                class="button is-info is-small"
                v-show="activeIndex==null || cRules.length==0"
                @click="addNewRule"
              >Add</button>
              <button
                class="button is-danger is-small"
                v-show="cRules.length &&  activeIndex>=0 && dStep==0"
                @click="delRule(1)"
              >Delete</button>
              <button
                class="button is-danger is-small"
                v-show="activeIndex>=0 && dStep==1"
                @click="delRule(2)"
              >
                Are you
                sure ?
              </button>
            </div>
          </div>
          <div class="column">
            <button
              v-show="displayState!='edit'"
              class="clickable"
              @click="display('edit')"
              title="Add new mapping rule after this position !"
            >
              <b-icon class="is-pulled-right clickable" icon="edit" size="is-small" type="is-dark"></b-icon>
            </button>
            <button
              v-show="displayState=='edit' && allCollapse==true"
              class="clickable"
              @click="allCollapse=false"
              title="Add new mapping rule after this position !"
            >
              <b-icon
                class="is-pulled-right clickable"
                icon="chevron-down"
                size="is-small"
                type="is-dark"
              ></b-icon>
            </button>
            <button
              v-show="displayState=='edit' && allCollapse==false"
              class="clickable"
              @click="allCollapse=true"
              title="Add new mapping rule after this position !"
            >
              <b-icon
                class="is-pulled-right clickable"
                icon="chevron-up"
                size="is-small"
                type="is-dark"
              ></b-icon>
            </button>

            <button
              v-show="displayState!='code'"
              class="clickable"
              @click="display('code')"
              title="Add new mapping rule after this position !"
            >
              <b-icon class="is-pulled-right clickable" icon="code" size="is-small" type="is-info"></b-icon>
            </button>
            <button
              v-show="displayState!='list'"
              class="clickable"
              @click="display('list')"
              title="Add new mapping rule after this position !"
            >
              <b-icon
                class="is-pulled-right clickable"
                icon="list"
                size="is-small"
                type="is-primary"
              ></b-icon>
            </button>
          </div>
        </div>

        <div v-if="displayState=='edit'">
          <rule-form
            v-model="activeRule"
            :functions="functions"
            :entity="entity"
            :collapse="allCollapse"
          ></rule-form>
        </div>

        <div v-if="displayState=='code'">
          <codemirror ref="editor" v-model="ruleCode"></codemirror>
        </div>

        <div class="list-view" v-if="displayState=='list'">
          <span class="tag is-primary">Targeting</span>
          <span class="tag is-default">Type: {{activeRule.targetType}}</span>
          <span class="tag is-default">Key factor :{{activeRule.hash}}</span>
          <span class="tag is-default">goTo :{{activeRule.hash}}</span>
          <hr />
          <span class="tag is-primary">Origin</span>
          <span class="tag is-default">Origin type :{{activeRule.originType}}</span>
          <codemirror v-model="activeRule.origin"></codemirror>

          <hr />
          <span class="tag is-primary">Validate</span>
          <span class="tag is-default" v-for="(v,idx) in activeRule.validate" :key="idx">{{v}}</span>
          <hr />
          <span class="tag is-primary">Transform</span>
          <span class="tag is-default" v-for="(v,idx) in activeRule.transform" :key="idx">{{v}}</span>

          <hr />
          <span class="tag is-primary">Drop</span>
          <span class="tag is-default" v-for="(v,idx) in activeRule.drop" :key="idx">{{v}}</span>
        </div>
      </div>
    </div>
    <div class="column is-12">
      <button class="button is-link" @click="update">Update</button>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ruleForm from "./mappingRule/rule.form.vue";
import fastMapping from "./fast.mapping.vue";

export default {
  name: "MappingRules",
  props: ["rules", "functions", "entity", "collector"],
  components: {
    draggable,
    ruleForm,
    fastMapping
  },
  data: function() {
    return {
      fastMappingIndex: [],
      fastAssignment: false,
      Properties: [],
      entityProperties: [],
      allCollapse: true,
      displayState: "edit",
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
    async update() {
      await this.$saveProject(this.project);
    },
    displayFastAssign() {
      this.newActiveIndex = null;
      this.activeIndex = null;
      this.fastAssignment = true;
    },
    display(state) {
      this.displayState = state;
      if (state == "code") {
        setTimeout(() => {
          this.$refs.editor.editor.refresh();
        }, 1);
      }
    },
    setNewRule(index) {
      this.fastAssignment = false;
      this.newActiveIndex = index;
      this.activeIndex = null;
      this.$set(this, "activeRule", {});
    },
    setRule(rule) {
      this.$set(this, "activeRule", rule);
    },
    addNewRule() {
      this.rules.splice(this.newActiveIndex, 0, this.activeRule);
      this.activeIndex = this.newActiveIndex;
      this.newActiveIndex = null;
    },
    delRule(step) {
      this.dStep = step;
      if (this.dStep == 2) {
        this.rules.splice(this.activeIndex, 1);
        this.dStep = 0;
        this.$set(this, "activeRule", {});
      }
    }
  },
  async mounted() {
    //this.activeIndex = 0;
    this.activeRule = {};
  },
  computed: {
    ruleCode() {
      return JSON.stringify(this.activeRule, null, 4);
    },
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

.list-view .tag {
  font-weight: bolder;
  margin-left: 10px;
  border: 1px solid #ccc;
}
#mapping-target {
}
.fast-mapping.table td {
  width: 100%;
}

#mapping-rules tr.clickable {
  border: 1px solid #ccc !important;
}

#mapping-rules tr.clickable td {
  padding: 5px;
}
.CodeMirror {
  border: 1px solid #ccc;
}
.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>