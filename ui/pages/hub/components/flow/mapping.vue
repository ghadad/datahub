<template>
  <div id="mapping-rules" v-if="$parent.$data.flowData.mapping" class="mapping-area">
    <div v-show="showHandler==false">
      <b-button
        class="button has-background-white-ter is-small top-btn"
        icon-right="code"
        icon-left="chevron-right"
        @click="showHandler=true"
      >Mapping post handler</b-button>
      <section>
        <mapping-rules
          ref="existsRules"
          :rules.sync="$parent.$data.flowData.mapping.config"
          :functions="functions"
          :entity="entity"
          :collector="$parent.$data.flowData.collector.config"
        ></mapping-rules>
      </section>
    </div>
    <div v-show="showHandler==true">
      <b-button
        class="button has-background-white-ter is-small top-btn"
        @click="showHandler=false"
        icon-left="chevron-right"
      >Mapping rules</b-button>

      <div class="field">
        <label class="label">Post mapping Handler</label>
        <cite>
          Arguments:
          newData - the new mapped data
          <br />oldData - the old data if exists
          <br />rawData - collector data
        </cite>
        <div class="editor control">
          <codemirror
            ref="mapHandler"
            :options="cmOptions"
            v-model="$parent.$data.flowData.mapping.handler"
          ></codemirror>
        </div>
        <button class="button is-link" @click="update">Update</button>
      </div>
    </div>
  </div>
</template>
<script>
import MappingRules from "./mapping.rules.vue";

export default {
  name: "mapping",
  components: {
    MappingRules
  },
  data: function() {
    return {
      defaultHandler:
        "async function(newData,oldData,rawData){ \n return newData;\n}",
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
      showHandler: false,
      functions: null,
      route: null,
      entity: {},
      project: this.$parent.$data.project
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
      await this.$saveProject(this.project);
    }
  },
  async mounted() {
    let self = this;

    this.functions = await this.$http.get("helpers/functions");
    this.route = this.$route;
    this.entity = this.$parent.$data.entityModel;

    // if (self.$_.get(self, "$parent.$data.flowData.mapping"))
    self.$parent.$data.flowData.mapping.handler =
      self.$parent.$data.flowData.mapping.handler || self.defaultHandler;
    this.editor = self.$refs.mapHandler.editor;
    this.editor.refresh();
    this.editor.on("beforeChange", function(cm, change) {
      if (~[0].indexOf(change.from.line)) {
        change.cancel();
      }
    });
  }
};
</script>
<style scope>
div.editor.control {
  padding: 20px;
}
.vue-codemirror-wrap {
  border: 1px solid #ccc;
  border-round: 3px;
}
.mapping-area button.is-small {
  font-weight: 700;
}
.top-btn {
  margin-bottom: 5px;
}
</style>