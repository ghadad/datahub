<template>
  <div>
    <h1 class="title is-5">Data source</h1>
    <div class="columns">
      <div class="column is-2">
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
        <div v-if="computedValue.dbAlias=='systemdb'" class="field">
          <label class="label">json orgainzer</label>
          <div class="control">
            <codemirror
              ref="queryEditor"
              style="min-height:400px; border:1px solid #CCC"
              :options="$helpers.cmOptions({mode:'sql'})"
              v-model="computedValue.query"
            ></codemirror>
          </div>
        </div>

        <div v-if="computedValue.dbAlias!='systemdb'" class="field">
          <label class="label">Source query</label>
          <div class="control">
            <codemirror
              ref="queryEditor"
              style="min-height:400px; border:1px solid #CCC"
              :options="$helpers.cmOptions({mode:'sql'})"
              v-model="computedValue.query"
            ></codemirror>
          </div>
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
      });
    }
  },
  async mounted() {
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