<template>
  <div>
    <h1 class="title is-4">Template engine : {{type}}</h1>
    <div class="field">
      <div class="label">Choose your favorite template engine</div>
      <b-radio v-model="computedValue.engine" native-value="mustache">Mustach</b-radio>
      <b-radio v-model="computedValue.engine" native-value="pug" title="Pug">Pug</b-radio>
      <b-radio native-value="handler" v-model="computedValue.engine" title="Handlebars">Handlebars</b-radio>
    </div>
    <div class="field">
      <label class="label">Template code</label>
      <div class="control">
        <codemirror
          ref="templateEditor"
          style="min-height:200px; border:1px solid #CCC"
          :options="$helpers.cmOptions({mode:'htmlmixed'})"
          v-model="computedValue.template"
        ></codemirror>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "templateOutput",
  props: ["value", "type"],
  data() {
    return {
      intialTemplateModel: {
        engine: ""
      }
    };
  },
  created() {},
  mounted() {
    setTimeout(() => this.$helpers.refresh(this.$refs.templateEditor), 1000);
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
<style scoped>
.b-radio.radio + .radio {
  margin-left: 50px;
}
</style>