<template>
<div>
  <section>
        <b-autocomplete
          :data="filteredDataArray"
          placeholder="type for lookup "
          v-model="computedGoTo"
          icon="magnify"
          @select="option => computedGoTo = option"
        >  <template slot="empty">No results found</template>
        </b-autocomplete>

  </section>    </div>

</template>

<script>
export default {
  name:"suggestions",
  props: ["rules", "entity","collector","value"],
  data() {
    return {
        allGrab :[],
        datasetValue:""
    };
  },
  mounted: function() {
    
    (this.collector.properties ||[]).forEach(p=>{
      this.allGrab.push("collector:"+p)
    });

    (this.entity.properties ||[]).forEach(p=>{
      this.allGrab.push("Entity:"+p.name)
    });
    
   // (this.rules.vars || []).forEach(p=>{
    //  this.allGrab.push("Entity:"+p.name)
   // });
    
  },
  computed: {    
    filteredDataArray() {
      let self = this;
      return this.allGrab
        .filter(option => {
          return (
            option
              .toString()
              .toLowerCase()
              .indexOf((self.datasetValue || "").toLowerCase()) >= 0
          );
        })
    },  
  computedGoTo :{
    get() { 
      return this.value ;
    },
    set(newValue) { 
        this.$emit("input", newValue);
   }

  }
}
};
</script>
<style scoped>

</style>