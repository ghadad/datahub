<template>
  <section>
    <div class="tag-head">
      <strong class="tag is-dark">
        Value origin
        <span></span>
      </strong>

      <span class="clickable" @click="toggle">
        <b-icon
          class="is-pulled-right clickable"
          :icon="isOpen?'chevron-right':'chevron-down'"
          size="is-medium"
          type="is-info"
        ></b-icon>
      </span>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-12">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-model="value.originType" native-value="collector">Collector property</b-radio>
                <b-radio v-model="value.originType" native-value="value">Simple value</b-radio>
                <b-radio v-model="value.originType" native-value="query">Select Query</b-radio>
                <b-radio v-model="value.originType" native-value="dataset">Predefine dataset</b-radio>
                <b-radio v-model="value.originType" native-value="eval">Evaluate</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-12" v-if="value.originType=='query'">
        <div class="columns">
          <div class="column is-10">
            <div class="field">
              <label class="label">Query</label>
              <codemirror class="control" :cmOptions="cmOptions" v-model="value.originQuery"></codemirror>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <label class="label">DB alias</label>

              <div class="select">
                <select v-model="value.originQueryDbAlias">
                  <option
                    v-for="db in dbAliases"
                    :key="db.dbAlias"
                    :value="db.dbAlias"
                  >{{db.client}}:{{db.dbAlias}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-11" v-if="value.originType=='eval'">
        <codemirror :cmOptions="cmOptions" v-model="value.originEval"></codemirror>
      </div>
      <div class="column is-3" v-if="value.originType=='value'">
        <input type="text" class="input text" v-model="value.originValue" />
      </div>
      <div class="column is-11" v-if="value.originType=='dataset'">
        <div class="columns">
          <suggestions v-model="value.originDataset" type="string" :suggestions="suggestDatasets"></suggestions>
          <suggestions
            v-for="(p,index) in value.originDatasetParams"
            :key="index"
            :placeholder="p.placeholder"
            :suggestions="paramsSuggestions"
            v-model="value.originDatasetParams[index].value"
          ></suggestions>
          <!--input v-for="(p,index) in value.originDatasetParams" :key="index" value="index" type="text" class="input text  column is-2" v-model="value.originDatasetParams[index].value" /-->
        </div>
      </div>

      <div class="column is-3" v-if="value.originType=='collector'">
        <suggestions
          v-model="value.originCollector"
          type="string"
          :suggestions="collectorSuggestions"
        ></suggestions>
      </div>
    </div>
    <!--pre>{{value}}</pre-->
    <!--div>{{entity.properties}}</div-->
  </section>
</template>
<script>
import Suggestions from "./suggestions.vue";
export default {
  name: "origin",
  props: ["value", "entity", "collapse"],
  components: { Suggestions },
  data() {
    return {
      dbAliases: [],
      cmOptions: {
        mode: "javascript",
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
          "Ctrl-Q": function(cm) {
            cm.foldCode(cm.getCursor());
          }
        },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      },
      isOpen: false,
      selectedDataset: null,
      availableDatasets: [],
      suggestDatasets: [],
      collectorSuggestions: [],
      originLabel: {
        value: "Simple value",
        query: "select one value query",
        dataset: "dataset",
        handler: "handler"
      },

      originType: null
    };
  },
  watch: {
    "$props.collapse": function() {
      this.isOpen = this.$props.collapse;
    },
    "value.originDataset": function() {
      if (this.value.originDataset) {
        this.selectedDataset = this.$_.find(
          this.availableDatasets,
          e => e._id == this.value.originDataset
        );
        if (this.selectedDataset)
          this.$set(
            this.value,
            "originDatasetParams",
            this.selectedDataset.parameters.map(e => {
              return { placeholder: e, type: "string" };
            })
          );
        else this.$set(this.value, "originDatasetParams", []);
      }
    },
    "value.originType": function() {
      this.isOpen = true; // this.value.originType == "query" ? false : true;
    }
  },
  mounted: async function() {
    let dbs = await this.$http.get("databases");
    this.$set(
      this,
      "dbAliases",
      dbs.map(d => {
        return {
          dbAlias: d._id,
          client: d.db.client
        };
      })
    );

    this.collectorSuggestions = this.$parent.flowData.collector.config.properties.map(
      e => {
        return {
          key: e,
          value: "Collector:" + e
        };
      }
    );

    this.availableDatasets = await this.$http.get("datasets");
    this.suggestDatasets = this.availableDatasets.map(e => {
      return {
        key: e._id,
        value: e._id
      };
    });
    this.isOpen = true; // this.value.originType == "query" ? false : true;
  },
  methods: {
    toggle: function() {
      this.isOpen = this.isOpen ? false : true;
    },
    getOriginLabel: function() {}
  },
  computed: {
    paramsSuggestions() {
      return (
        this.$_.concat(
          this.collectorSuggestions,
          (this.entity.properties || []).map(e => {
            return {
              key: e.name,
              value: "Entity:" + e.name
            };
          }),
          this.rules
            .filter(
              (r, index) => r.targetType == "variable" && index < this.ruleIndex
            )
            .map(e => {
              return {
                key: e.goToVar,
                value: "Var:" + e.goToVar
              };
            })
        ) || []
      );
    },
    rules() {
      return this.$parent.rules;
    },
    ruleIndex() {
      return this.$parent.ruleIndex;
    },
    filteredDataArray() {
      return this.$parent.flowData.collector.config.properties.filter(
        option => {
          return (
            option
              .toString()
              .toLowerCase()
              .indexOf((this.value.origin || "").toLowerCase()) >= 0
          );
        }
      );
    }
  }
};
</script>
<style scoped>
label.b-radio.radio {
  margin-right: 30px;
}
</style>