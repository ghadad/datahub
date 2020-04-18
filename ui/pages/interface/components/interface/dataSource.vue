<template>
  <div>
    <h1 class="title is-5">Data source</h1>
    <div class="columns">
      <div class="column is-2">
        <div class="label">Source type</div>

        <div class="select">
          <select v-model="computedValue.sourceType">
            <option value=" ">Choose source</option>
            <option value="query">Sql Query</option>
            <option value="systemDB">Nosql system DB</option>
          </select>
        </div>
      </div>
      <div class="column is-2" v-if="computedValue.sourceType== 'query'">
        <div class="label">DB alias</div>

        <div class="select">
          <select v-model="computedValue.dbAlias">
            <option
              v-for="db in databases"
              :key="db._id"
              :value="db._id"
            >{{db.db.client}}:{{db._id}}</option>
          </select>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Concurrency</label>
          <div class="select">
            <select v-model="computedValue.concurrency">
              <option v-for="(c,index) in [1,2,3,4,5,6,7,8,9,10]" :key="index" :value="c">{{c}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-7">
        <div v-show="computedValue.sourceType=='systemDB'" class="field">
          <label class="label">Source entity</label>
          <div class="control">
            <input class="input" v-model="computedValue.sourceEntity" type="text" />
          </div>
        </div>

        <div v-show="computedValue.sourceType== 'query'" class="field">
          <label class="label">Source query</label>
          <div class="control">
            <codemirror
              ref="queryEditor"
              style="min-height:200px; border:1px solid #CCC"
              :options="$helpers.cmOptions({mode:'sql'})"
              v-model="computedValue.query"
            ></codemirror>
          </div>
        </div>
        <b-checkbox v-model="computedValue.hasFilter">Add filter handler</b-checkbox>

        <div v-show="computedValue.hasFilter" class="control">
          <label class="label">Filtering result</label>
          <em>Handler must retrieve true/false value</em>
          <codemirror
            ref="filterEditor"
            style="min-height:200px; border:1px solid #CCC"
            :options="$helpers.cmOptions()"
            v-model="computedValue.filter"
          ></codemirror>
        </div>
      </div>
      <div class="column is-5">
        <div class="block">
          <div class="field">
            <label class="label">Define the entity key method</label>
            <div class="select">
              <select v-model="computedValue.keyType">
                <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="block" v-show="computedValue.keyType=='pkField'">
          <div class="field">
            <label class="label">Field Name (must existgs in Query result)</label>
            <div class="control">
              <input class="input" v-model="computedValue.pkField" type="text" />
            </div>
          </div>
        </div>
        <div class="block" v-show="computedValue.keyType=='pkHandler'">
          <div class="field">
            <label class="label">Define the key using function</label>
            <div class="control">
              <codemirror
                style="min-height:100px"
                ref="functionEditor"
                :options="$helpers.cmOptions()"
                v-model="computedValue.pkHandler"
              ></codemirror>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div clas="block">{{databases}}</div>
  </div>
</template>
<script>
export default {
  name: "data-source",
  props: { value: Object, active: Number },
  data() {
    return {
      handlerTemplate: "function(data){ \n return data; \n }",
      keyTypes: {
        pkHandler: "function/handler",
        pkField: "Header field"
      },
      databases: []
    };
  },
  watch: {
    active() {
      this.$nextTick(() => {
        this.$helpers.refresh(this.$refs.functionEditor);
        this.$helpers.refresh(this.$refs.queryEditor);
        this.$helpers.refresh(this.$refs.filterEditor);
      });
    }
  },
  methods: {
    addFilter() {
      this.computedValue.hasFilter = true;
      this.$set(
        this.computedValue,
        "filter",
        this.computedValue.filter || this.handlerTemplate
      );
    },
    removeFilter() {
      this.computedValue.hasFilter = false;
    }
  },
  async mounted() {
    let self = this;
    this.$helpers.lock1Line(this.$refs.filterEditor);

    this.$helpers.refresh(this.$refs.filterEditor);
    this.databases = [
      { _id: "systemdb", db: { client: "nosql" } },
      ...(await this.$http.get("docs/databases"))
    ];
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