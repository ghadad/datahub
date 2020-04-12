<template>
  <section v-if="list">
    <div class="tag-head">
      <strong class="tag title is-dark">{{title}}</strong>
      Drag & drop to reorder the {{title}}
    </div>

    <div class="columns">
      <div class="column is-full functions-list">
        <div>
          <draggable v-model="dragableList">
            <span v-for="(t,index) in dragableList" :key="index">
              <span class="op" v-show="index>0">{{op}}</span>
              <div class="func-tag tag">
                <span @click="setActive(t,index)">{{displayT(t)}}</span>
                <span @click="handleDrop(index)" class="icon is-small clickable">
                  <i class="fas fa-times-circle"></i>
                </span>
              </div>
            </span>
          </draggable>
        </div>
      </div>
    </div>
    <section class="add-rule notification">
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
            <button v-show="activeIndex==null" @click="upsertFunc" class="button is-dark">Add</button>
            <button
              v-show="activeIndex != null"
              @click="upsertFunc(activeIndex)"
              class="button is-dark"
            >Update</button>
          </div>
        </div>
      </div>
    </section>
    <div class v-show="0">{{activeFuncDesc}}</div>
  </section>
</template>

<script>
import draggable from "vuedraggable";
//import { Drag, Drop } from "vue-drag-drop";

export default {
  name: "functions",
  props: ["title", "list", "functions", "op"],
  data() {
    return {
      activeParamsError: [],
      activeFunc: null,
      activeParamsRules: [],
      activeParams: [],
      activeNot: null,
      activeIndex: null
      //  dragableList:[]
    };
  },
  components: { draggable },
  watch: {
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
      this.activeIndex = null;
    },
    upsertFunc: function(updatePosition = null) {
      let self = this;
      let errorFound = false;
      if (!self.activeFunc) return;

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
        if (schema.required && !self.activeParams[i]) {
          errorFound = true;
          self.activeParamsError[i].error = "Value is required";
        }
      }

      if (errorFound) return;
      if (updatePosition >= 0)
        self.dragableList[updatePosition] = [
          (self.activeNot ? "!" : "") + self.activeFunc,
          ...self.activeParams
        ];
      else
        self.dragableList.push([
          (self.activeNot ? "!" : "") + self.activeFunc,
          ...self.activeParams
        ]);
      self.activeParams = [];
      self.activeFunc = "";
      self.activeNot = null;
      self.activeIndex = null;
    },
    setActive: function(t, index) {
      let func = t[0];
      this.activeParams = [];
      //    let ps = this.functions[func.replace("!", "")].params || [];
      for (let i = 1; i < t.length; i++) {
        this.activeParams.push(t[i]);
      }
      this.activeFunc = func.replace("!", "");
      this.activeNot = func.match(/!/) ? true : false;
      this.activeIndex = index;
    },
    displayT: function(t) {
      let func = t[0];
      //    let ps = this.functions[func.replace("!", "")].params || [];
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
  font-weight: 700;
}
div.func-tag .icon {
  padding-left: 15px;
  padding-right: 10px;
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