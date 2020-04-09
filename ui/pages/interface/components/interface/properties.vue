<template>
  <div>
    <h1>properties</h1>
    {{computedValue}}
  </div>
</template>
<script>
export default {
  name: "properties",
  props: ["value"],
  mounted() {
    this.computedValue = this.computedValue || {};

    this.computedValue.origin = this.computedValue.origin || { origin: "" };
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