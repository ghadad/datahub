<template>
  <div v-if="flowData.collector">
    <h1>FLOW</h1>
    <div class="columns">
      <div class="column is-5">
        <div class="columns">
          <div class="column is-5">
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
          <div class="column is-5">
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
        </div>
        <div class="column is-12">
          <b-field label="Description">
            <b-input
              maxlength="300"
              type="textarea"
              v-model="flowData.collector.config.description"
            ></b-input>
          </b-field>
        </div>
      </div>
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
      flowData: {}
    };
  },

  async mounted() {
    this.flowData = this.$parent.$data.flowData;
  }
};
</script>
