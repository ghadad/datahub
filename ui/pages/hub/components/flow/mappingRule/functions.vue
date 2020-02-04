<template>
  <section v-if="list">
    <div class="tag-head">
      <strong class="tag title is-dark">{{title}}</strong>
      Drag & drop to reorder the {{title}}
      <span class="clickable" @click="isOpen=!isOpen">
        <b-icon class="is-pulled-right clickable" :icon="isOpen?'chevron-right':'chevron-down'" size="is-medium"
          type="is-info"></b-icon>
      </span>
    </div>
    <div class="columns" v-show="1">
      <div class="column is-12">
        <div>
          <draggable v-model="dragableList">
            <span v-for="(t,index) in dragableList" :key="index"> <span v-show="index>0"> {{op}} </span>
              <span :title="functions[t[0]]? functions[t[0]].desc:''" class="func-tag tag">{{displayT(t)}}</span>
            </span>
          </draggable>
        </div>
      </div>
    </div>
    <section v-show="isOpen">
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
        <span class="column is-2" v-for="(p,index) in activeFuncDesc.params" :key="index">
          {{p.label}}
          <input v-if="p.type!='code'" class="input" v-model="activeParams[index]" :type="p.type" />
          <textarea v-if="p.type=='code'" v-model="activeParams[index]" />
          </span>
      <div class="column is-1">
      <div style="padding-top:20px">
        <button @click="addrule" class="button is-dark">Add</button>
        </div>
      </div>
    </div>
    </section>
    <div class v-show="isOpen">{{activeFuncDesc}}</div>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  props: ["title", "list", "functions","op"],
  data() {
    return {
      isOpen: false,
      activeFunc: null,
      activeParamsRules: [],
      activeParams: []
      //  dragableList:[]
    };
  },
  components: { draggable },
  mounted: function() {
    this.dragableList = this.dragableList || [];
  },
  methods: {
    addrule: function() {
      this.dragableList.push([this.activeFunc, ...this.activeParams]);
      this.activeParams = [];
      this.activeFunc ="";
    },
    displayT: function(t) {
      let func = t[0];
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
  background-color:White !important;
  border: 1px solid #BBB;
}
.tag-head .title {margin-bottom:10px}
</style>