<template>
  <div>
    <h1 class="title is-4">CSV OUTPUT</h1>
  </div>
</template>
<script>
export default {
  name: "templateOutput",
  props: ["value"],
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