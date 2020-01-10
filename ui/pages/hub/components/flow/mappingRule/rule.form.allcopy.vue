<template>
  <div>
    <h1>Rule</h1>
    <div class="columns">
      <div class="column is-4">
        <div class="field">
          <label class="label">Target property</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="go to"
              v-model="value.goTo"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" />
            Revision factor
          </label>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        sql function
        <div class="field">
          <div class="control">
            <textarea rows="3" class="textarea" v-model="value.sqlFunction"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        URL(RESTAPI)
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="url"
              v-model="value.restapi"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        storeProcedure
        <div class="field">
          <div class="control">
            <textarea rows="3" class="textarea" v-model="value.storeProc"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Validations pipeline</label>
          <div class="select">
            <select v-model="activeValdation">
              <option v-for="(vk,vf) in functions.validations" :key="vk" :value="vk">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeValdation.desc}}</div>
      <div class="column is-2">
        {{activeValdation.params}}
        <button>Add to pipeline</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Trasformation pipeline</label>
          <div class="select">
            <select v-model="activeTransformation">
              <option v-for="(vk,vf) in functions.transforms" :key="vk" :value="vk">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeTransformation.desc}}</div>
      <div class="column is-2">
        {{activeTransformation.params}}
        <button>Add to pipeline</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Drop conditions (now support only OR )</label>
          <div class="select">
            <select v-model="activeDrop">
              <option v-for="(vk,vf) in functions.validations" :key="vk" :value="vk">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeDrop.desc}}</div>
      <div class="column is-2">
        {{activeDrop.params}}
        <button>Add to pipeline</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        Post rule Handler
        <div class="field">
          <div class="control">
            <textarea rows="15" class="textarea" v-model="value.ruleHandler"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "csv-collector",
  props: ["value", "functions"],
  data: function() {
    return {
      activeDrop: {},

      activeValdation: {},
      activeTransformation: {},
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`
    };
  },
  watch: {
    keyType: function(newVal, oldVal) {
      if (newVal == "pkHandler") this.value.pkHandler = this.handlerTemplate;
    }
  },
  async mounted() {
    this.value.ruleHandler = this.handlerTemplate;
  }
};
</script>