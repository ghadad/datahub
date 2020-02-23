<template>
<div>
  <section>
        <b-autocomplete
          :data="filteredDataArray"
          :placeholder="placeholder || 'type for lookup'"
          v-model="computedGoTo"
          @select="option => computedGoTo = option.key"
        >  <template slot="empty">No results found</template>
        </b-autocomplete>

  </section>    </div>

</template>

<script>
export default {
  name:"suggestions",
  props: ["value","suggestions","placeholder"],
  data() {
    return {
        allGrab :[],
        datasetValue:""
    };
  },
  mounted: function() {
   
    
   // (this.rules.vars || []).forEach(p=>{
    //  this.allGrab.push("Entity:"+p.name)
   // });
    
  },
  computed: {    
    filteredDataArray() {
      let self = this;
      return this.suggestions
        .filter(option => {
          return (
            option.key
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