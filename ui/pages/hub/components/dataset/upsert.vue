<template>
  <div>
    <h2 class="title" v-show="!$route.query.id">Create new dataset</h2>
    <h2 class="title" v-show="$route.query.id">Update dataset :{{$route.query.id}}</h2>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Dataset id</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Dataset id"
              v-model="formData._id"
              pattern="/\w+/"
              :disabled="$route.query.id"
              @change="formData._id=$normalizeName(formData._id)"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
        </div>
      </div>
      <div class="column is-1">
        <div class="field">
          <label class="label">Prefetch ?</label>
          <div class="control">
            <b-checkbox v-model="formData.prefetch"></b-checkbox>
          </div>
        </div>
      </div>
      <div class="column is-5">
        <div class="field">
          <label class="label">Short description</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Short description"
              v-model="formData.description"
            />
          </div>
        </div>
      </div>
      <div class="column is-2"></div>
    </div>
    <div class="columns">
      <div class="column is-7">
        <div class="field">
          <label class="label">SQL query</label>
          <div class="control">
            <codemirror ref="handler" :cmOptions="cmOptions" v-model="formData.query"></codemirror>
          </div>
        </div>
      </div>
      <div class="column is-5">
        <label class="label">Parameters</label>
        <div class>
          <div v-for="(p,index) in parameters" :key="p" class="field has-addons">
            <p class="control">
              <a class="button is-static">{{index+1}}</a>
            </p>
            <div class="control">
              <input class="input" type="text" placeholder="Parameter name" :value="p" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="buttons">
        <button class="button is-primary" v-show="!$route.query.id" @click="create">Create</button>
        <button class="button is-link" v-show="$route.query.id" @click="update">Update</button>
        <button class="button is-dark" @click="test">Test query</button>
        <button class="button is-success" v-show="testSuccess" @click="test">Connect success</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "datasetUpert",
  data() {
    return {
      testSuccess: false,
      cmOptions: {
        mode: "sql",
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {
          "Ctrl-Q": function(cm) {
            cm.foldCode(cm.getCursor());
          }
        },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      },
      formData: {
        _id: null,
        description: null,
        query: "",
        params: []
      }
    };
  },
  async mounted() {
    if (this.$route.query.id) {
      this.formData._id = this.$route.query.id;
      this.$set(
        this,
        "formData",
        await this.$http.get("datasets/" + this.$route.query.id)
      );
    }
  },
  methods: {
    async test() {
      await this.$http.post("datasets/test", this.formData);
      this.testSuccess = true;
      setTimeout(() => (this.testSuccess = false), 3000);
    },
    async update() {
      await this.$saveModel("datasets", this.formData);
    },
    async create() {
      await this.$saveModel("datasets", this.formData, {
        name: "datasetsIndex"
      });
    }
  },
  computed: {
    parameters: {
      get() {
        return this.formData.query.match(/:\w+/g);
      }
    }
  }
};
</script>
