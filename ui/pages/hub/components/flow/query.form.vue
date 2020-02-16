<template>
  <div>
    <h1 class="title is-4">
      DB query properties
      <button
        class="button is-dark"
        v-show="fetchStep==1"
        @click="fetchInfo()"
      >Fetch properties from first header row</button>
      <button class="button is-dark" v-show="fetchStep==2" @click="fetchInfo()">Are you sure ?</button>
    </h1>
    <hr />
    <div class="columns">
      <div class="column is-6">
        <div class="field">
          <label class="label">Source query</label>
          <div class="control">
            <codemirror :options="cmOptions" v-model="collector.query"></codemirror>
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">DB alias</label>

          <div class="select">
            <select v-model="collector.dbAlias">
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
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Define the entity key method</label>
          <div class="select">
            <select v-model="collector.keyType">
              <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-4" v-if="collector.keyType=='pkField'">
        <div class="field">
          <label class="label">Field Name (must existgs in Query result)</label>
          <div class="control">
            <input class="input" v-model="collector.pkField" type="text" />
          </div>
        </div>
      </div>
      <div class="column is-10" v-if="collector.keyType=='pkHandler'">
        <div class="field">
          <label class="label">Define the key using function</label>
          <div class="control">
            <textarea rows="15" class="textarea" v-model="collector.pkHandler"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "csv-collector",
  props: ["collector", "properties"],
  data: function() {
    return {
      fetchStep: 1,
      cmOptions: {
        mode: "sql",
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
      dbAliases: [],
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`,
      keyType: null,
      keyTypes: {
        pkHandler: "function/handler",
        pkField: "Header field"
      }
    };
  },
  watch: {
    keyType: function(newVal, oldVal) {
      if (newVal == "pkHandler")
        this.collector.pkHandler = this.handlerTemplate;
    }
  },
  methods: {
    async fetchInfo() {
      let result;
      if (this.fetchStep == 1 && this.dragableList.length == 0) {
        result = await this.$http.post(
          `flow/fetch-info`,
          this.$parent.flowData
        );
      }
      if (this.fetchStep == 1 && this.dragableList.length > 0) {
        this.fetchStep = 2;
        setTimeout(() => (this.fetchStep = 1), 3000);
        return;
      }
      if (this.fetchStep == 2 && this.dragableList.length > 0) {
        result = await this.$http.post(
          `flow/fetch-info`,
          this.$parent.flowData
        );
      }
      if (result.length) this.$set(this, "dragableList", result);
    }
  },
  async mounted() {
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
  },
  comouted: {}
};
</script>