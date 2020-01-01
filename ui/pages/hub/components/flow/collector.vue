<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Entity name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="flowData.collector.config.name"
              pattern="/\w+/"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
          <p v-for="(e,index) in errors" :key="index">{{e}}</p>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Source type</label>
          <div class="select">
            <select v-model="flowData.collector.config.sourceType">
              <option
                v-for="source in sources"
                :key="source.type"
                :value="source.type"
              >{{source.description}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field" v-if="flowData.collector.config.sourceType=='query'">
          <label class="label">Source type</label>
          <div class="select">
            <select v-model="flowData.collector.config.sourceType">
              <option
                v-for="source in sources"
                :key="source.source"
                :value="source.source"
              >{{source.description}}</option>
            </select>
          </div>

          <div class="field" v-if="flowData.collector.config.sourceType=='csv'">
            <div class="field">
              <label class="label">seperator</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Entity name"
                  v-model="flowData.collector.config.seperator"
                  pattern="/\w+/"
                />
              </div>
              <p class="help">unique name . use only alphanumeric letters</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field" v-if="flowData.collector.config.sourceType=='csv'">
      <div class="field">
        <label class="label">Source Path</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Entity name"
            v-model="flowData.collector.config.sourcePath"
            pattern="/\w+/"
          />
        </div>
        <p class="help">unique name . use only alphanumeric letters</p>
      </div>
    </div>
    <div class="field" v-if="flowData.collector.config.sourceType=='restapi'">
      <div class="field">
        <label class="label">URL</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Entity name"
            v-model="flowData.collector.config.sourceUrl"
            pattern="/\w+/"
          />
        </div>
        <p class="help">unique name . use only alphanumeric letters</p>
      </div>
    </div>
    <div class="column is-12" v-if="flowData.collector.config.sourceType=='query'">
      <b-field label="Source DB Query ">
        <b-input maxlength="300" type="textarea" v-model="flowData.collector.config.description"></b-input>
      </b-field>
    </div>
    <b-message title="params" type="is-info" aria-close-label="Close message">{{$route.params}}</b-message>
    <b-message
      title="collector.config"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.collector.config}}</b-message>
    <b-message
      title="collector.handler"
      type="is-info"
      aria-close-label="Close message"
    >{{flowData.collector.handler}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "collector",
  data: function() {
    return {
      errors: [],
      sources: $serverConfig.sources,
      flowData: {}
    };
  },

  async mounted() {
    this.flowData = this.$parent.$data.flowData;
  }
};
</script>
