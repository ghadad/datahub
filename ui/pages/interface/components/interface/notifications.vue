<template>
  <div>
    <h1>notifications</h1>
    <input class="input" v-model="computedValue.email" />
    <b-checkbox>Failures notifications ?</b-checkbox>
    <div class="block">Success creation notification</div>
    <div class="block">Empty result notifictions</div>
    <div class="block">emailing result</div>
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