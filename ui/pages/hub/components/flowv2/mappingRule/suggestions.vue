<template>
  <div>
    <section>
      <b-autocomplete
        :data="filteredDataArray"
        :placeholder="placeholder || 'type for lookup'"
        v-model="computedGoTo"
        @select="option => computedGoTo = option.key"
      >
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </section>
  </div>
</template>

<script>
export default {
  name: "suggestions",
  props: ["value", "suggestions", "placeholder", "type"],
  data() {
    return {
      allGrab: [],
      datasetValue: ""
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
      return this.suggestions.filter(option => {
        return (
          option.value
            .toString()
            .toLowerCase()
            .indexOf((self.computedGoTo || "").toLowerCase()) >= 0
        );
      });
    },
    computedGoTo: {
      get() {
        if (this.type == "string") return this.value;
        let originType = this.$_.get(this.value, "originType", "");
        originType = originType ? originType + ":" : "";
        return originType + this.$_.get(this.value, "originValue", "");
      },
      set(newValue) {
        if (this.type == "string") return this.$emit("input", newValue);

        let updateValue = {};
        let arr = (newValue || "").split(":");
        if (arr[1]) {
          updateValue.originValue = arr[1];
          updateValue.originType = arr[0];
        } else {
          updateValue.originValue = arr[0];
          //  updateValue.originType = "value";
        }
        this.$emit("input", updateValue);
      }
    }
  }
};
</script>
<style scoped>
</style>