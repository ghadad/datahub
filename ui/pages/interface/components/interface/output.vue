<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <div class="label">Choose output format</div>
        <div class="select">
          <select v-model="computedValue.type">
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
            <option value="XML">XML</option>
            <option value="FIXED">FIXED LENTGH RECORD</option>
            <option value="HTML">HTML</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
      </div>
      <div class="column is-5">
        <div class="label">Directory</div>
        <div class="field">
          <input class="input" v-model="computedValue.directory" />
        </div>
      </div>
      <div class="column is-5">
        <div class="label">File name</div>
        <div class="field">
          <input class="input" v-model="computedValue.fileName" />
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <b-checkbox v-model="computedValue.provideAPI">Provide API ?</b-checkbox>
      </div>
      <div class="column is-4">
        <b-checkbox
          v-model="computedValue.createOnEmpty"
        >Create file when Interface retrieves empty result</b-checkbox>
      </div>
    </div>
    <div class="block">
      <csv-output v-if="computedValue.type=='CSV'" v-model="computedValue"></csv-output>
      <json-output v-if="computedValue.type=='JSON'" v-model="computedValue"></json-output>
      <template-output type="XML" v-if="computedValue.type=='XML'" v-model="computedValue"></template-output>
      <template-output type="FIXED" v-if="computedValue.type=='FIXED'" v-model="computedValue"></template-output>
      <template-output type="HTML" v-if="computedValue.type=='HTML'" v-model="computedValue"></template-output>
      <template-output type="PDF" v-if="computedValue.type=='PDF'" v-model="computedValue"></template-output>
    </div>
    computedValue.config:{{computedValue}}
  </div>
</template>
<script>
import CsvOutput from "./csv.vue";
import JsonOutput from "./json.vue";
import TemplateOutput from "./templateEngine.vue";

export default {
  name: "product-output",
  props: ["value"],
  components: {
    CsvOutput,
    JsonOutput,
    TemplateOutput
  },
  data() {
    return {
      initconfig: {
        engine: ""
      }
    };
  },
  created() {},
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