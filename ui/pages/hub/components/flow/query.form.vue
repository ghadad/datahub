<template>
  <div>
    <h1 class="title is-4">
      Collector properties
      <button
        class="button is-dark"
        v-show="fetchStep==1"
        @click="fetchInfo()"
      >Fetch properties from query result</button>
      <button class="button is-dark" v-show="fetchStep==2" @click="fetchInfo()">Are you sure ?</button>
    </h1>
    <div class="columns">
      <div class="column is-4">
        <div class="field is-horizontal">
          <div class="field-label has-text-left">
            <label class="label">Field name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input" type="text" placeholder="Field name" v-model="column" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-1">
        <button class="button is-info" @click="add">Add</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div>
          <draggable v-model="dragableList">
            <div
              v-for="(t,index) in dragableList"
              :key="index"
              class="dragable property-tag tag is-default"
            >
              {{index}} : {{t}}
              <span class="clickable" @click="del(index)">
                <b-icon class="is-pulled-right clickable" icon="trash" size="is-small" type></b-icon>
              </span>
            </div>
          </draggable>
        </div>
        <hr />
      </div>
    </div>
    <div class="columns">
      <div class="column is-9">
        <div class="field">
          <label class="label">Source query</label>
          <div class="control">
            <codemirror style="min-height:300px" :options="cmOptions" v-model="collector.query"></codemirror>
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
            <codemirror style="min-height:200px" :options="cmOptions" v-model="collector.pkHandler"></codemirror>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "query-collector",
  props: ["collector", "properties"],
  components: { draggable },
  data: function() {
    return {
      column: null,
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
    keyType: function(newVal) {
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
      if (result.length) this.dragableList = result;
    },
    add(name) {
      if (!name) return;
      this.dragableList.push(this.column);
      this.column = null;
    },
    del(index) {
      this.dragableList.splice(index, 1);
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
  computed: {
    dragableList: {
      get() {
        return this.$props.properties || [];
      },
      set(newValue) {
        this.$emit("update:properties", newValue);
      }
    }
  }
};
</script>
<style scoped>
.vue-codemirror-wrap {
  border: 1px solid #ccc;
  padding: 2px;
}
.dragable {
  cursor: grab;
}
</style>