<template>
  <div v-if="flowData.collector">
    <div v-show="!showHandler">
      <div>
        <h3 class="title is-4">
          Collector settings
          <b-button
            class="button is-info is-pulled-right"
            icon-right="code"
            @click="showHandler=true"
          >Collector handler</b-button>
        </h3>
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
          <csv-form
            :collector="flowData.collector.config"
            :properties.sync="flowData.collector.config.properties"
          ></csv-form>
        </div>
        <div v-if="flowData.collector.config.sourceType=='restapi'">
          <restapi-form
            :collector="flowData.collector.config"
            :properties.sync="flowData.collector.config.properties"
          ></restapi-form>
        </div>
        <div v-if="flowData.collector.config.sourceType=='query'">
          <query-form
            :collector="flowData.collector.config"
            :properties.sync="flowData.collector.config.properties"
          ></query-form>
        </div>
      </div>
    </div>
    <div v-show="showHandler">
      <h1 class="title">
        Collector handler
        <b-button
          class="button is-info is-pulled-right"
          icon-right="code"
          @click="showHandler=false"
        >Collecotr setting</b-button>
      </h1>

      <div class="field">
        <label class="label">Post collector handler</label>
        <cite>
          Arguments:
          <br />raw - collector data row
        </cite>
        <div class="control">
          <codemirror ref="handler" :cmOptions="cmOptions" v-model="flowData.collector.handler"></codemirror>
        </div>
      </div>
    </div>

    <div class="column is-12">
      <button class="button is-link" @click="update">Update</button>
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
      defaultHandler: "async function(rawData){ \n return newData;\n}",
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
      editor: null,
      entitiesKeys: [],
      errors: [],
      showHandler: false,
      flowData: {},
      project: {}
    };
  },
  watch: {
    showHandler: function() {
      //this.editor.setSize(500, 300);
      setTimeout(() => {
        this.editor.refresh();
      }, 1);
    }
  },
  methods: {
    async update() {
      await this.$saveProject(this.$parent.$data.project);
    }
  },
  async mounted() {
    this.flowData = this.$parent.$data.flowData;

    this.$_.set(
      this.flowData,
      "collector.config.concurrency",
      this.$_.get(this.flowData, "collector.config.concurrency", 8)
    );
    this.$_.set(
      this.flowData,
      "collector.config.properties",
      this.$_.get(this.flowData, "collector.config.properties", [])
    );

    this.entitiesKeys = Object.keys(this.$parent.$data.project.entities);

    if (!this.flowData.collector.handler)
      this.flowData.collector.handler = this.defaultHandler;
    setTimeout(() => {
      this.editor = this.$refs.handler.editor;
      this.editor.on("beforeChange", function(cm, change) {
        if (~[0].indexOf(change.from.line)) {
          change.cancel();
        }
      });
    }, 100);
  },
  computed: {
    sources: () => $serverConfig.sources
  }
};
</script>
<style scoped>
cite {
  font-weight: 800;
}
</style>