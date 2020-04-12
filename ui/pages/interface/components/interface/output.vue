<template>
  <div>
    <input class="input" v-model="computedValue.fileName" />
    <b-checkbox>Provide API ?</b-checkbox>
    <div class="block">format : CSV</div>
    <div class="block">format : JSON</div>
    <div class="block">format : XML (template engine)</div>
    <div class="block">format : Any (/template engine) includes fixed size</div>
    <div class="block">format : Html,PDF (template engine)</div>
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