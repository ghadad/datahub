<template>
  <section v-if="list">
     <div class="tag-head">
        <strong class="tag title  is-dark">{{title}}</strong> Drag & drop to reorder the {{title}}
      </div>
      <div class="columns">
    <div class="column is-12">
    <div>
              <draggable v-model="dragableList">
              <span v-for="(t,index) in dragableList" :key="index" class="func-tag tag is-info">{{displayT(t)}}</span>
              </draggable></div>
      </div>

    </div>
    <div class="columns">
      <div class="column is-1 sub-tag-head">
        <strong class="tag title is-7 is-default">Add new</strong>
      </div>
      <div class="column is-2">
        <div class="field">
          <div class="select">
            <select v-model="activeFunc">
              <option v-for="(vk,vf) in functions" :key="vf" :value="vf">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-7"><span v-for="(p,index) in activeFuncDesc.params" :key="index">
      {{p.label}}
       <input v-if="p.type!='code'" v-model="activeParams[index]" :type="p.type" />
       <textarea v-if="p.type=='code'" v-model="activeParams[index]" />
       </span></div>
      <div class="column is-1">
        <button @click="addrule" class="buttun is-info">Add</button>
      </div>
    </div>
      <div class="">{{activeFuncDesc}}</div>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  props: ["title","list", "functions"],
  data() {
    return {
      activeFunc: null,
      activeParamsRules:[],
      activeParams:[]    ,
    //  dragableList:[]
    };
  },
  components: { draggable },
  mounted: function() {
   this.dragableList = this.dragableList || [];
  },
  methods: {
    addrule: function() {
      this.dragableList.push([this.activeFunc,...this.activeParams]);

    },
    displayT: function(t){
      let func = t[0];
      let params = [];
      for(let i = 1; i<t.length;i++){
        params.push(t[i])
      }
      return func + "(" + params.join(",")+")";
    }
  },
  computed: {
    dragableList:{
      get() { 
        return this.list;
      },
      set(newValue){
         this.$emit('update:list', newValue)
      }
    },
    activeFuncDesc : function() { 
      let desc =  this.functions[this.activeFunc] || {};
      desc.params = desc.params || [];
      return desc;
    }
  }
};
</script>
<style>
.func-tag {display:inline;margin-right:5px;margin-bottom:5px;font-size:1em !important;cursor:pointer}
</style>