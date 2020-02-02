<template>
  <div>
    <h1>DB query properties</h1>
    <div class="columns">
      <div class="column is-6">
        <div class="field">
          <label class="label">Source query</label>
          <div class="control">
            <textarea
              size="1"
              class="textarea"
              rows="40"
              v-model="collector.query"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">DB alias</label>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Define the entity key method</label>
          <div class="select">
            <select v-model="keyType">
              <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-4" v-if="keyType=='pkField'">
        <div class="field">
          <label class="label">Field Name (must existgs in Query result)</label>
          <div class="control">
            <input class="input" v-model="collector.pkField" type="text" />
          </div>
        </div>
      </div>
      <div class="column is-10" v-if="keyType=='pkHandler'">
        <div class="field">
          <label class="label">Define the key using function</label>
          <div class="control">
            <textarea rows="15" class="textarea" v-model="collector.pkHandler"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "csv-collector",
  props: ["collector", "properties"],
  data: function() {
    return {
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`,
      keyType: null,
      keyTypes: {
        pkHandler: "function/handler",
        pkField: "Header field"
      }
    };
  },
  watch: {
    keyType: function(newVal, oldVal) {
      if (newVal == "pkHandler")
        this.collector.pkHandler = this.handlerTemplate;
    }
  },
  async mounted() {}
};
</script>