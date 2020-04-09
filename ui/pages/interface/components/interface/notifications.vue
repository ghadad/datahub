<template>
  <div>
    <h1>notifications</h1>
    <input v-model="computedValue.dsdsds" />
  </div>
</template>
<script>
export default {
  name: "notifications",
  props: ["value"],
  mounted() {},
  computed: {
    computedValue: {
      get() {
        return this.$props.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>