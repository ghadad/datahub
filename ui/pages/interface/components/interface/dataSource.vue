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
    <div v-if="computedValue.dbAlias=='systemdb'" class="columns">
      <div class="column is-9">
        <div class="field">
          <label class="label">json orgainzer</label>
          <div class="control">
            <codemirror
              style="min-height:300px; border:1px solid #CCC"
              :options="$helpers.cmOptions({mode:'sql'})"
              v-model="computedValue.query"
            ></codemirror>
          </div>
        </div>
      </div>
    </div>

    <div v-if="computedValue.dbAlias!='systemdb'" class="columns">
      <div class="column is-9">
        <div class="field">
          <label class="label">Source query</label>
          <div class="control">
            <codemirror
              style="min-height:300px; border:1px solid #CCC"
              :options="$helpers.cmOptions({mode:'sql'})"
              v-model="computedValue.query"
            ></codemirror>
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
  props: { value: Object },
  data() {
    return {
      databases: []
    };
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