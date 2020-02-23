<template>
  <section>
    <div class="tag-head">
      <strong class="tag is-dark">
        Value origin
        <span></span>
      </strong>

      <span class="clickable" @click="toggle">
        <b-icon
          class="is-pulled-right clickable"
          :icon="isOpen?'chevron-right':'chevron-down'"
          size="is-medium"
          type="is-info"
        ></b-icon>
      </span>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-12">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-model="value.originType" native-value="collector">Collector property</b-radio>
                <b-radio v-model="value.originType" native-value="value">Simple value</b-radio>
                <b-radio v-model="value.originType" native-value="query">Select Query</b-radio>
                <b-radio v-model="value.originType" native-value="dataset">Predefine dataset</b-radio>
                <b-radio v-model="value.originType" native-value="handler">Evaluate</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-1"> 
        <strong class="label">{{originLabel[value.originType]}}</strong>
      </div>
      <div class="column is-11" v-if="value.originType=='query'">
        <textarea rows="5" class="textarea" v-model="value.originQuery"></textarea>
      </div>
      <div class="column is-3" v-if="value.originType=='value'">
        <input type="text" class="input text" v-model="value.originValue" />
      </div>
      
      <div class="column is-11" v-if="value.originType=='dataset'">
      <div class="columns">
        <suggestions v-model="value.originDataset" :suggestions="suggestDatasets" :entity="entity" :collector="$parent.flowData.collector.config"></suggestions>

        <suggestions v-for="(p,index) in value.originDatasetParams" :key="index"  :placeholder="p.placeholder" :suggestions="[]"  :entity="entity" :collector="$parent.flowData.collector.config"  v-model="value.originDatasetParams[index].value">
        </suggestions>
        <!--input v-for="(p,index) in value.originDatasetParams" :key="index" value="index" type="text" class="input text  column is-2" v-model="value.originDatasetParams[index].value" /-->
        
      </div><div v-if="selectedDataset">{{selectedDataset}}</div> 
      </div>
     
      <div class="column is-3" v-if="value.originType=='collector'">
         <b-autocomplete
          v-model="value.originCollector"
          :data="filteredDataArray"
          placeholder="type for lookup "
          icon="magnify"
          @select="option => value.origin = option"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
    </div>
    </div>
    <!--pre>{{value}}</pre-->
    <!--div class="panel-block" v-show="targeting=='property'">
      {{entity.properties}}
     
    </div-->
  </section>
</template>

<script>
import Suggestions from "./suggestions.vue";
export default {
  name: "origin",
  props: ["value", "entity", "collapse"],
  components:{Suggestions},
  data() {
    return {
      isOpen: false,
      selectedDataset:null,
      availableDatasets :[],
      suggestDatasets:[],
      originLabel: {
        value: "Simple value",
        query: "select one value query",
        dataset: "dataset",
        handler: "handler"
      },

      originType: null
    };
  },
  watch: {
    "$props.collapse": function() {
      this.isOpen = this.$props.collapse;
 
    },
    'value.originDataset':function(){
       if(this.value.originDataset) { 
         this.selectedDataset = this.$_.find(this.availableDatasets,(e)=>e._id==this.value.originDataset);
         if(this.selectedDataset)
            this.$set(this.value,'originDatasetParams',this.selectedDataset.parameters.map(e=>{
              return {placeholder:e,type:"string"}
            }))
         else 
             this.$set(this.value,'originDatasetParams',[])
       }
     },
    "value.originType": function() {
      this.isOpen = true ;// this.value.originType == "query" ? false : true;
    }
  },
  mounted: async  function() {
    
    this.availableDatasets  = await this.$http.get("datasets");
    this.suggestDatasets  = this.availableDatasets.map(e=> {
      return {
        key:e._id,
        value:e._id,
      }
    })
    this.isOpen = true ;// this.value.originType == "query" ? false : true;
  },
  methods: {
    toggle: function() {
      this.isOpen = this.isOpen ? false : true;
    },
    getOriginLabel: function() {}
  },
  computed: {
        filteredDataArray() {
      return this.$parent.flowData.collector.config.properties
        .filter(option => {
          return (
            option
              .toString()
              .toLowerCase()
              .indexOf((this.value.origin || "").toLowerCase()) >= 0
          );
        })
        
    }
  }
};
</script>