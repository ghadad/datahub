<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">sql id</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Sql id"
              v-model="formData._id"
              pattern="/\w+/"
              :disabled="$route.query.id"
              @change="formData._id=$normalizeName(formData._id)"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
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
            <codemirror ref="handler" :options="{mode:'sql'}" v-model="formData.query"></codemirror>
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
  name: "sqlUpsert",
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
  watch: {
    parameters: function() {
      this.$set(this.formData, "parameters", this.parameters);
    }
  },
  async mounted() {
    if (this.$route.query.id) {
      this.formData._id = this.$route.query.id;
      this.$set(
        this,
        "formData",
        await this.$http.get("sqls/" + this.$route.query.id)
      );

      this.formData.filterHandler =
        this.formData.filterHandler || "function(data){ \n}";
    }
  },
  methods: {
    async test() {
      await this.$http.post("sqls/test", this.formData);
      this.testSuccess = true;
      setTimeout(() => (this.testSuccess = false), 3000);
    },
    async update() {
      await this.$saveModel("sqls", this.formData);
    },
    async create() {
      await this.$saveModel("sqls", this.formData, {
        name: "sqlIndex"
      });
    }
  },
  computed: {
    parameters() {
      return this.$_.uniq(this.formData.query.match(/:\w+/g));
    }
  }
};
</script>
