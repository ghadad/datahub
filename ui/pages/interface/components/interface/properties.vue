<template>
  <div>
    <h1 class="title is-4">
      properties
      <button
        @click="fetchConfirm=true"
        class="button is-primary is-small"
        v-show="fetchConfirm==false"
      >Fetch properties from data source</button>
      <button
        @click="fetchProps"
        class="button is-danger is-small"
        v-show="fetchConfirm==true"
      >Are you sure ?</button>
    </h1>
    <div class="columns">
      <div class="column is-4">
        <div>
          <button @click="restActiveRule" class="button is-black is-small">Add new property</button>
        </div>
        <table class="table is-fullwidth">
          <draggable v-model="computedValue.props" tag="tbody">
            <tr class="clickable" v-for="(p,index) in computedValue.props" :key="p.name">
              <td @click="activate(p)">{{index +1}}</td>
              <td @click="activate(p)">{{p.name}}</td>
              <td>
                <span class="icon" v-show="!delItems[p.name]" @click="delProp(index,1)">
                  <b-icon icon="trash" type="is-danger" size="is-small"></b-icon>
                </span>
                <span v-show="delItems[p.name]==1" @click="delProp(index,2)">
                  <button class="button is-danger">Confirm</button>
                </span>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
      <div v-if="Object.keys(activeRule).length==0" class="column is-8">
        <center class="section">
          <input v-model="newName" style="max-width:300px" type="text" class="input" />
        </center>
        <center>
          <button @click="addProp(newName)" class="button is-link is-large">Add property</button>
        </center>
      </div>
      <div v-if="Object.keys(activeRule).length" class="column is-8">
        <h4 class="title is-4">
          <input type="text" class="input control" v-model="activeRule.name" />
          {{activeRule.name}}
        </h4>
        <div class="checkboxes">
          <b-checkbox v-model="activeRule.deltaFactor">Is Delta factor ?</b-checkbox>
          <b-checkbox
            v-model="activeRule.statInd"
            title="grab statistic data like sum/min/max/avg"
          >Is Statistic ?</b-checkbox>
          <b-checkbox
            v-model="activeRule.hidden"
            title="check it if youwant to hide this value from interface"
          >hidden ?</b-checkbox>
        </div>
        <div class="checkboxes">
          <b-checkbox
            v-model="activeRule.groupByInd"
            title="group result by this property"
          >Group result rows By this property ?</b-checkbox>
          <b-checkbox
            v-model="activeRule.splitByInd"
            title="Split output product by this property"
          >Split products By this property ?</b-checkbox>
        </div>
        <div class="block">
          <strong class="is-5">Value origin</strong>
          <div class="radios">
            <b-radio v-model="activeRule.originType" native-value="collector">data source prop ?</b-radio>
            <b-radio
              v-model="activeRule.originType"
              native-value="eval"
              title="Eval expression"
            >evaluate</b-radio>
            <b-radio native-value="handler" v-model="activeRule.originType" title="handler">handler</b-radio>
          </div>

          <input
            v-if="activeRule.originType=='collector'"
            type="input"
            class="input"
            v-model="activeRule.originProperty"
          />
          <div v-if="activeRule.originType=='eval'">
            <emp>Use rawData & newData & $vars objects to access collector data and new mapped data</emp>
            <codemirror
              ref="evalEditor"
              :options="$helpers.cmOptions()"
              v-model="activeRule.originEval"
            ></codemirror>
          </div>
        </div>
        <div class="rules-checkbox-group">
          <b-checkbox v-model="activeRule.hasTransform" type="is-info">Add transforms</b-checkbox>
          <b-checkbox v-model="activeRule.hasValidation" type="is-info">Add validations</b-checkbox>
          <b-checkbox v-model="activeRule.hasDrop" type="is-info">Add Drops</b-checkbox>
        </div>
        <div v-if="activeRule.hasTransform" class="block">
          <functions
            title="Transform rules"
            class="rule-section"
            :list.sync="activeRule.transform"
            :functions="functions.transforms"
            op="->"
          ></functions>
        </div>
        <div v-if="activeRule.hasValidation" class="block">
          <functions
            title="Validation rules"
            class="rule-section"
            :list.sync="activeRule.validate"
            :functions="functions.validations"
            op="and"
          ></functions>
        </div>
        <div v-if="activeRule.hasDrop" class="block">
          <functions
            title="Drop rules"
            class="rule-section"
            :list.sync="activeRule.drop"
            :functions="functions.validations"
            op="or"
          ></functions>
        </div>
        <div class="section">{{activeRule}}</div>
      </div>
    </div>
    {{computedValue}}
  </div>
</template>
<script>
import draggable from "vuedraggable";
import Functions from "./functions.vue";

export default {
  name: "properties",
  components: { draggable, Functions },
  props: ["value", "source"],
  data() {
    return {
      fetchConfirm: false,
      addError: null,
      newName: null,
      functions: {},
      activeRule: {},
      list: [],
      delItems: {}
    };
  },
  methods: {
    restActiveRule() {
      this.$set(this, "activeRule", {});
    },
    checkUnique(name) {
      return this.$_.findIndex(this.computedValue.props, p => p.name == name);
    },
    addProp(name) {
      this.addError = "";
      let exists = this.checkUnique(name);
      if (exists >= 0)
        return (this.addError = `Name ${name} already exists in props list`);
      this.activeRule.name = name;
      this.computedValue.props.push(this.$_.cloneDeep(this.activeRule));
      this.$set(
        this,
        "activeRule",
        this.computedValue.props[this.computedValue.props.length - 1]
      );
    },
    delProp(index, step) {
      let propName = this.computedValue.props[index].name;
      if (step == 1) {
        this.$set(this.delItems, propName, step);
        setTimeout(() => (this.delItems[propName] = 0), 3000);
      }
      if (step == 2) {
        delete this.delItems[propName];
        this.computedValue.props.splice(index, 1);
        if (this.activeRule.name == propName) {
          this.$set(this, "activeRule", {});
        }
      }
    },
    activate(p) {
      this.$set(this, "activeRule", p);
    },
    async fetchProps() {
      this.list = await this.$http.post(`interface/fetch-info`, this.source);

      this.$set(
        this.computedValue,
        "props",
        this.list.map(e => {
          return {
            name: e,
            targetType: "property",
            originType: "collector",
            originProperty: e,
            display: true,
            deltaFactor: true,
            goTo: e,
            transform: [],
            drop: [],
            validate: [],
            statInd: false
          };
        })
      );
      this.fetchConfirm = false;
      this.$set(this, "delItems", {});
    }
  },
  watch: {
    "activeRule.originType": function(newVal) {
      if (newVal == "eval") this.activeRule.originType = "eval";
      if (newVal == "collector") this.activeRule.originType = "collector";
    }
  },
  async mounted() {
    this.functions = await this.$http.get("helpers/functions");
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>
<style>
.checkboxes .b-checkbox {
  margin-right: 40px;
}
.block {
  border-top: 1px dotted #ccc;
}
</style>