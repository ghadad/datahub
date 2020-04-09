<template>
  <div>
    <h1>product-output</h1>
    <input v-model="computedValue.dsdsds" />
  </div>
</template>
<script>
export default {
  name: "product-output",
  props: ["value"],
  mounted() {
    this.computedValue.description = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>