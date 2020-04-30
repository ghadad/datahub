<template>
  <div>
    <h1 class="title is-4">Template engine : {{type}}</h1>
    <div class="field">
      <div class="label">Choose your favorite template engine</div>
      <b-radio v-model="computedValue.engine" native-value="handlebars">
        <a href="https://handlebarsjs.com/guide/" target="_handlebars">Handlebars</a>
      </b-radio>
      <b-radio v-model="computedValue.engine" native-value="mustache">
        <a href="https://mustache.github.io/mustache.5.html" target="_mustache">Mustach</a>
      </b-radio>
      <b-radio v-model="computedValue.engine" native-value="pug" title="Pug">
        <a href="https://pugjs.org/api/getting-started.html" target="_pug">Pug</a>
      </b-radio>
      <b-radio v-model="computedValue.engine" native-value="ejs" title="Ejs">
        <a href="https://ejs.co/" target="_ejs">Ejs</a>
      </b-radio>
    </div>
    <div class="field">
      <label class="label">Template code</label>
      <div class="control">
        <codemirror
          ref="templateEditor"
          style="min-height:200px; border:1px solid #CCC"
          :options="$helpers.cmOptions({mode:'html'})"
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
  watch: {
    "$route.query.activeTab": function() {
      this.$helpers.refresh(this.$refs.templateEditor);
    }
  },
  created() {},
  mounted() {
    this.$helpers.refresh(this.$refs.templateEditor);
  },
  updated() {},
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