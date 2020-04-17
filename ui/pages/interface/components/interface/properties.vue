<template>
  <div>
    <h1 class="title is-4">
      properties
      <button
        @click="fetchProps"
        class="button is-primary is-small"
      >Fetch properties from data source</button>
    </h1>
    <div class="columns">
      <div class="column is-4">
        <table class="table is-fullwidth">
          {{delItems}}
          <draggable v-model="computedValue.props" tag="tbody">
            <tr class="clickable" v-for="(p,index) in computedValue.props" :key="p.name">
              <td @click="activate(p)">{{index +1}}</td>
              <td @click="activate(p)">{{p.name}}</td>
              <td>
                <span class="icon" v-show="!delItems[index]" @click="delProp(index,1)">
                  <b-icon icon="trash" type="is-danger" size="is-small"></b-icon>
                </span>
                <span v-show="delItems[index]==1" @click="delProp(index,2)">
                  <button class="button is-danger">Confirm</button>
                </span>
              </td>
              <td>[+]</td>
            </tr>
          </draggable>
        </table>
      </div>
      <div class="column is-8">
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
        <div class="block">
          <h5 class="title is-5">Value origin</h5>
          <b-radio v-model="activeRule.origin" native-value="source">data source prop ?</b-radio>
          <b-radio
            v-model="activeRule.origin"
            native-value="eval"
            title="grab statistic data like sum/min/max/avg"
          >evaluate</b-radio>
          <b-radio
            native-value="handler"
            v-model="activeRule.origin"
            title="check it if youwant to hide this value from interface"
          >handler</b-radio>
        </div>
        <div class="rules-checkbox-group">
          <b-checkbox v-model="activeRule.hasTransform" type="is-info">Add transforms</b-checkbox>
          <b-checkbox v-model="activeRule.hasValidation" type="is-info">Add validations</b-checkbox>
          <b-checkbox v-model="activeRule.hasDrop" type="is-info">Add Drops</b-checkbox>
        </div>
        <div class="block">
          <functions
            v-if="activeRule.hasTransform"
            title="Transform rules"
            class="rule-section"
            :list.sync="activeRule.transform"
            :functions="functions.transforms"
            op="->"
          ></functions>
        </div>
        <div class="block">
          <functions
            v-if="activeRule.hasValidation"
            title="Validation rules"
            class="rule-section"
            :list.sync="activeRule.validate"
            :functions="functions.validations"
            op="and"
          ></functions>
        </div>
        <div class="block">
          <functions
            v-if="activeRule.hasDrop"
            title="Drop rules"
            class="rule-section"
            :list.sync="activeRule.validate"
            :functions="functions.validations"
            op="or"
          ></functions>
        </div>
        <div class="block">{{activeRule}}</div>
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
    return { functions: {}, activeRule: {}, list: [], delItems: {} };
  },
  methods: {
    delProp(index, step) {
      if (step == 1) {
        this.$set(this.delItems, index, step);
        setTimeout(() => (this.delItems[index] = 0), 3000);
      }
      if (step == 2) {
        delete this.delItems[index];
        this.computedValue.props.splice(index, 1);
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
            origin: "source",
            originProperty: e,
            display: true,
            deltaFactor: true,

            transform: [],
            drop: [],
            validate: [],
            statInd: false
          };
        })
      );
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