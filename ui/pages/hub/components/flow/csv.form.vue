<template>
  <div>
    <h1>CSV Source properties</h1>
    <div class="columns">
      <div class="column is-1">
        <div class="field">
          <label class="label">seperator</label>
          <div class="control">
            <input
              size="1"
              class="input"
              type="text"
              placeholder="Seperator"
              v-model="value.seperator"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-8">
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
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Source type</label>
          <div class="select">
            <select v-model="keyType">
              <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-1" v-if="keyType=='pkIndex'">
        <div class="field">
          <label class="label">Field Position</label>
          <div class="control">
            <input class="input" v-model="value.pkIndex" type="integer" />
          </div>
        </div>
      </div>
      <div class="column is-2" v-if="keyType=='pkHeader'">
        <div class="field">
          <label class="label">Field header</label>
          <div class="control">
            <input class="input" v-model="value.pkHeader" type="text" />
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
  name: "csv-collector",
  props: ["value"],
  data: function() {
    return {
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`,
      keyType: null,
      keyTypes: {
        pkIndex: "Field position",
        pkHandler: "function/handler",
        pkHeader: "Header field"
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