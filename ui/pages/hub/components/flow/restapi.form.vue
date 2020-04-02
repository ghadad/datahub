<template>
  <div>
    <h5 class="title is-5">
      Rest API source properties
      <button
        class="button is-dark"
        v-show="fetchStep==1"
        @click="fetchInfo()"
      >
        Fetch properties from first header
        row
      </button>
      <button class="button is-dark" v-show="fetchStep==2" @click="fetchInfo()">Are you sure ?</button>
    </h5>
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
      <div class="column is-12">
        <div>
          <draggable v-model="dragableList">
            <div
              v-for="(t,index) in dragableList"
              :key="index"
              class="dragable property-tag tag is-default"
            >
              {{index}} : {{t}}
              <span class="clickable" @click="del(index)">
                <b-icon class="is-pulled-right clickable" icon="trash" size="is-small" type></b-icon>
              </span>
            </div>
          </draggable>
        </div>

        <hr />
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Define the entity key method</label>
          <div class="select">
            <select v-model="collector.keyType">
              <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-4" v-show="collector.keyType=='pkPath'">
        <div class="field">
          <label class="label">Json path value (must existgs in Query result) e.g : data.info.id</label>
          <div class="control">
            <input class="input" v-model="collector.pkPath" type="text" />
          </div>
        </div>
      </div>
      <div class="column is-10" v-show="collector.keyType=='pkHandler'">
        <div class="field">
          <label class="label">Define the key using function</label>
          <div class="control">
            <codemirror
              style="min-height:100px"
              ref="functionEditor"
              :options="$helpers.cmOptions()"
              v-model="collector.pkHandler"
            ></codemirror>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "restapi-collector",
  props: ["collector", "properties"],
  components: {
    draggable
  },

  data: function() {
    return {
      fetchStep: 1,
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return __app.$_.get(data,'customerInfo.customerId',999999)
      }`,
      keyType: null,
      keyTypes: {
        pkHandler: "function/handler",
        pkPath: "json path"
      }
    };
  },
  methods: {
    delHeader(index) {
      this.collector.headers.splice(index, 1);
    },
    addHeader() {
      this.collector.headers.push({
        name: "",
        value: ""
      });
    },
    async fetchInfo() {
      let result;
      if (this.fetchStep == 1 && this.dragableList.length == 0) {
        result = await this.$http.post(
          `flow/fetch-info`,
          this.$parent.flowData
        );
      }
      if (this.fetchStep == 1 && this.dragableList.length > 0) {
        this.fetchStep = 2;
        setTimeout(() => (this.fetchStep = 1), 3000);
        return;
      }
      const loadingComponent = this.$buefy.loading.open({});
      if (this.fetchStep == 2 && this.dragableList.length > 0) {
        result = await this.$http.post(
          `flow/fetch-info`,
          this.$parent.flowData
        );
      }
      if (result.length) this.dragableList = result;
    },
    add(name) {
      if (!name) return;
      this.dragableList.push(this.csvField);
      this.csvField = null;
    },
    del(index) {
      this.dragableList.splice(index, 1);
    }
  },
  watch: {
    "collector.keyType": function(newVal) {
      if (newVal == "pkHandler")
        this.collector.pkHandler = this.handlerTemplate;
    }
  },
  created() {
    this.collector.pkHandler = this.collector.pkHandler || this.handlerTemplate;
  },
  async mounted() {
    if (!this.collector.headers) this.$set(this.collector, "headers", []);
    this.$helpers.lock1Line(this.$refs.functionEditor);
  },
  computed: {
    dragableList: {
      get() {
        return this.properties || [];
      },
      set(newValue) {
        this.$emit("update:properties", newValue);
      }
    }
  }
};
</script>
<style scoped>
.dragable {
  cursor: grab;
}
</style>