<template>
  <section v-if="list">
    <div class="tag-head">
      <strong class="tag title is-dark">{{title}}</strong>
      Drag & drop to reorder the {{title}}
      <span class="clickable" @click="isOpen=!isOpen">
        <b-icon
          class="is-pulled-right clickable"
          :icon="isOpen?'chevron-right':'chevron-down'"
          :title="isOpen?'':'Expand to add new function'"
          size="is-medium"
          type="is-info"
        ></b-icon>
      </span>
    </div>

    <div class="columns" v-show="1">
      <div class="column is-full functions-list">
        <div>
          <drop class="dropzone is-pulled-right" @drop="handleDrop">
            <b-icon type="is-danger" icon="trash"></b-icon>
          </drop>
          <draggable v-model="dragableList">
            <span v-for="(t,index) in dragableList" :key="index">
              <span class="op" v-show="index>0">{{op}}</span>
              <drag
                :transfer-data="index"
                :title="functions[t[0]]? functions[t[0]].desc:''"
                class="func-tag tag"
              >
                <span>{{displayT(t)}}</span>
              </drag>
            </span>
          </draggable>
        </div>
      </div>
    </div>
    <section v-show="isOpen" class="add-rule notification">
      <strong class="add-func-title">Add new function</strong>
      <div class="columns">
        <div class="column is-1" v-if="op=='and' || op=='or'">
          Not ?
          <div class="field">
            <b-checkbox v-model="activeNot" native-value="handler"></b-checkbox>
          </div>
        </div>
        <div class="column is-2">
          Select function
          <div class="field">
            <div class="select">
              <select v-model="activeFunc">
                <option v-for="(vk,vf) in functions" :key="vf" :value="vf">{{vf}}</option>
              </select>
            </div>
          </div>
        </div>
        <span
          class="column"
          :class="p.type=='code'?'is-8':'is-2'"
          v-for="(p,index) in activeFuncDesc.params"
          :key="index"
        >
          {{p.label}}
          <input
            v-if="p.type!='code'"
            class="input"
            v-model="activeParams[index]"
            :type="p.type"
          />
          <textarea rows="5" class="textarea" v-if="p.type=='code'" v-model="activeParams[index]" />
          <span class="perror" v-if="activeParamsError[index]">{{activeParamsError[index].error}}</span>
        </span>
        <div class="column is-1">
          <div style="padding-top:20px">
            <button @click="addFunc" class="button is-dark">Add</button>
          </div>
        </div>
      </div>
    </section>
    <div class v-show="0">{{activeFuncDesc}}</div>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";

export default {
  props: ["title", "list", "functions", "op", "collapse"],
  data() {
    return {
      activeParamsError: [],
      isOpen: this.$props.collapse,
      activeFunc: null,
      activeParamsRules: [],
      activeParams: [],
      activeNot: null
      //  dragableList:[]
    };
  },
  components: { draggable, Drag, Drop },
  watch: {
    "$props.collapse": function() {
      this.isOpen = this.$props.collapse;
    },
    dragableList: function() {
      this.$forceUpdate();
    }
  },
  mounted: function() {
    this.dragableList = this.dragableList || [];
  },
  methods: {
    handleDrop: function(index) {
      this.dragableList.splice(index, 1);
    },
    addFunc: function() {
      let self = this;
      let errorFound = false;
      if (!self.activeFunc) return;
      let paramsSchema = self.functions[self.activeFunc].params || [];
      self.$set(
        self,
        "activeParamsError",
        self.$_.cloneDeep(self.activeFuncDesc.params || [])
      );

      if (self.activeFunc == "customFunction") {
        if (!self.activeParams[0]) {
          self.activeParamsError[0].error = "Function is required";
          return;
        }

        if (!self.activeParams[0].match(/function/i)) {
          self.activeParamsError[0].error = "Syntax error";
          return;
        }

        try {
          self.$eval("var func = " + self.activeParams[0]);
        } catch (e) {
          self.activeParamsError[0].error = "Syntax error";
          return;
        }
      }

      for (var i = 0; i < self.activeFuncDesc.params.length; i++) {
        let schema = self.activeFuncDesc.params[i];
        console.log("schema:", schema, "val:", self.activeParams[i]);
        if (schema.required && !self.activeParams[i]) {
          errorFound = true;
          self.activeParamsError[i].error = "Value is required";
        }
      }

      if (errorFound) return;
      self.dragableList.push([
        (self.activeNot ? "!" : "") + self.activeFunc,
        ...self.activeParams
      ]);
      self.activeParams = [];
      self.activeFunc = "";
      self.activeNot = null;
    },
    displayT: function(t) {
      let func = t[0];
      let ps = this.functions[func].params || [];
      let params = [];
      for (let i = 1; i < t.length; i++) {
        params.push(t[i]);
      }
      return func + "(" + params.join(",") + ")";
    }
  },
  computed: {
    dragableList: {
      get() {
        return this.list;
      },
      set(newValue) {
        this.$emit("update:list", newValue);
      }
    },
    activeFuncDesc: function() {
      let desc = this.functions[this.activeFunc] || {};
      desc.params = desc.params || [];
      return desc;
    }
  }
};
</script>
<style>
.func-tag {
  display: inline;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 1em !important;
  cursor: pointer;
  background-color: White !important;
  border: 1px solid #bbb;
}
.tag-head .title {
  margin-bottom: 10px;
}
span.op {
  padding: 5px;
  color: navy;
  font-weight: bolder;
}
.add-rule.notification {
  margin: 0px;
  border: 1px solid #bbb;
  padding: 5px;
}
.functions-list {
  margin: 0;
  padding-top: 5px;
  padding-bottom: 5px;
}
.add-func-title {
  text-decoration: underline;
}
.perror {
  color: red;
}
</style>