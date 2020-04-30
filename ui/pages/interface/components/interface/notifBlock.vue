<template>
  <div>
    <b-checkbox v-model="computedValue.active">Active ?</b-checkbox>
    <b-checkbox
      v-if="type!='failure'"
      v-model="computedValue.attach"
    >Attach file result to mail body ?</b-checkbox>

    <h1 class="title is-4">{{title}}</h1>

    <div class="columns">
      <div class="column is-12">
        <b-field horizontal label="Subject" message="Please enter a subject">
          <b-input name="subject" expanded v-model="computedValue.subject"></b-input>
        </b-field>
        <b-field horizontal label="Emails" message="seperate mail addresses by comma or space">
          <b-input name="to" expanded v-model="computedValue.to"></b-input>
        </b-field>
        <b-field horizontal label="Cc" message="seperate mail address by comma or space">
          <b-input name="cc" expanded v-model="computedValue.cc"></b-input>
        </b-field>
        <b-field horizontal label="Bcc" message="seperate mail address by comma or space">
          <b-input name="bcc" expanded v-model="computedValue.bcc"></b-input>
        </b-field>
      </div>
    </div>
    <h3 class="title is-5">Message body</h3>
    <div class="columns">
      <div class="column is-3">
        <div class="field">
          <div class="label">Content type</div>
          <b-radio v-model="computedValue.contentType" native-value="html">HTML</b-radio>
          <b-radio v-model="computedValue.contentType" native-value="text">Text</b-radio>
        </div>
      </div>
      <div class="column is-7">
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
      </div>
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
  props: ["value", "title", "type"],
  data() {
    return {
      intialTemplateModel: {
        engine: ""
      }
    };
  },
  watch: {
    "$route.query.notifTab": function() {
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