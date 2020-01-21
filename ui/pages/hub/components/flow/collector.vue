<template>
  <div v-if="flowData.collector">
    <div v-if="!$route.query.handler">
      <div>
        <h1>FLOW</h1>
        <div class="columns">
          <div class="column is-2">
            <div class="field">
              <label class="label">Collector name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Collector  name"
                  v-model="flowData.collector.config.name"
                  pattern="/\w+/"
                />
              </div>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <label class="label">Source type</label>
              <div class="select">
                <select v-model="flowData.collector.config.sourceType">
                  <option
                    v-for="source in sources"
                    :key="source.type"
                    :value="source.type"
                  >{{source.description}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <label class="label">Concurrency</label>
              <div class="select">
                <select v-model="flowData.collector.config.concurrency">
                  <option v-for="(c,index) in [1,2,3,4,5,6,7,8,9,10]" :key="index" :value="c">{{c}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-if="flowData.collector.config.sourceType=='csv'">
          <csv-form v-model="flowData.collector.config"></csv-form>
        </div>
        <div v-if="flowData.collector.config.sourceType=='restapi'">
          <restapi-form v-model="flowData.collector.config"></restapi-form>
        </div>
        <div v-if="flowData.collector.config.sourceType=='query'">
          <query-form v-model="flowData.collector.config"></query-form>
        </div>

        <div class="column is-12">
          <button class="button is-link" @click="update">Update</button>
          <pre style="max-width:800px">{{flowData.collector}}</pre>
        </div>
      </div>
    </div>
    <div v-if="$route.query.handler">
      <div class="field">
        <label class="label">Post collector handler</label>
        <div class="control">
        <codemirror v-model="flowData.collector.handler"></codemirror>        
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CsvForm from "./csv.form.vue";
import QueryForm from "./query.form.vue";
import RestapiForm from "./restapi.form.vue";

export default {
  name: "collector",
  components: {
    CsvForm,
    QueryForm,
    RestapiForm
  },
  data: function() {
    return {
     
      errors: [],
      sources: $serverConfig.sources,
      flowData: {}
    };
  },

  methods: {
    update() {
      this.$root.$emit("update-project");
    }
  },

  async mounted() {
    this.flowData = this.$parent.$data.flowData;
    this.$_.set(this.flowData, "flowData.collector.config.concurrency", 1);
  }
};
</script>