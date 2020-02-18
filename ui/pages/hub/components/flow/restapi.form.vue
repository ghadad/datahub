<template>
  <div>
    <h5 class="title is-5">Rest API source properties</h5>
    <div class="columns">
      <div class="column is-10">
        <div class="field">
          <label class="label">URL</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="collector.sourcePath"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-10">
        <div class="field">
          <label class="label">Json path to data set</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Json path to data set"
              v-model="collector.dataPath"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
    </div>
    <h5 class="title is-5">
      Custom request headers
      <button
        class="button is-small is-dark"
        @click="addHeader()"
      >Add new header entry</button>
    </h5>
    <div class="columns">
      <div class="column is-3">
        <div class="label">Name</div>
      </div>
      <div class="column is-8">
        <div class="label">Value</div>
      </div>
      <div class="column is-1"></div>
    </div>
    <div v-for="(h,index) in collector.headers" :key="index" class="columns">
      <div class="column is-3">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="h.name"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-8">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="h.value"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-1">
        <div class="field">
          <button class="button is-danger is-small" @click="delHeader(index)">Remove</button>
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
          <label class="label">any depth path to key value e.g "customerInfo.customerId"</label>
          <div class="control">
            <input class="input" v-model="collector.pkPath" type="text" />
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
  name: "restapi-collector",
  props: ["collector", "properties"],
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
  methods: {
    delHeader(index) {
      this.collector.headers.splice(index, 1);
    },
    addHeader() {
      this.collector.headers.push({ name: "", value: "" });
      this.$nextTick();
    }
  },
  watch: {
    keyType: function(newVal) {
      if (newVal == "pkHandler")
        this.collector.pkHandler = this.handlerTemplate;
    }
  },
  async mounted() {
    this.collector.headers = this.collector.headers || [];
  }
};
</script>