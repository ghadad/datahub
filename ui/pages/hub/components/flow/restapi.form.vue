<template>
  <div>
    <h1>Rest API source  properties</h1>
    <div class="columns">
      <div class="column is-10">
        <div class="field">
          <label class="label">URL</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="value.sourceUrl"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Source Path</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="value.sourcePath"
              pattern="/\w+/"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
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
      <div class="column is-4" v-if="keyType=='pkPath'">
        <div class="field">
          <label class="label">any depth path to key value e.g "customerInfo.customerId" </label>
          <div class="control">
            <input class="input" v-model="value.pkPath" type="text" />
          </div>
        </div>
      </div>
      <div class="column is-10" v-if="keyType=='pkHandler'">
        <div class="field">
          <label class="label">Define the key using function</label>
          <div class="control">
            <textarea rows="15" class="textarea" v-model="value.pkHandler"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "restapi-collector",
  props: ["value"],
  data: function() {
    return {
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return __app.$_.get(data,'customerInfo.customerId',999999)
      }`,
      keyType: null,
      keyTypes: {
        pkHandler: "function/handler",
        pkPath: "Path to key"        
      }
    };
  },
   watch: {
    keyType: function(newVal, oldVal) {
      if (newVal == "pkHandler") this.value.pkHandler = this.handlerTemplate;
    }
  },  
  async mounted() {}
};
</script>