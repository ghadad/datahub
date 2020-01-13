<template>
  <div>
    <h2 class="title" v-show="!dbAlias">Set new project</h2>
    <h2 class="title" v-show="dbAlias">Update project</h2>
    <div class="columns">
      <div class="column">
        <p v-for="(e,index) in errors" :key="index" class="has-text-danger">{{e}}</p>
      </div>
    </div>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Project name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Project name"
              v-model="formData.projectName"
              pattern="/\w+/"
              :disabled="dbAlias"
            />
          </div>

          <p class="help">unique name . use only alphanumeric letters</p>

          <p v-for="(e,index) in errors.projectName" :key="index">{{e}}</p>
        </div>
      </div>
    </div>
    <div>
      <div class="columns">
        <div class="column is-7">
          <b-field label="Description">
            <b-input maxlength="300" type="textarea" v-model="formData.description"></b-input>
          </b-field>
        </div>
        <div class="column is-2">
          <div class="field">
            <b-checkbox v-model="formData.enableStaging">Enable staging</b-checkbox>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" v-show="!projectName" @click="create">Create</button>
        <button class="button is-link" v-show="projectName" @click="update">Update</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "upsert",
  data() {
    return {
      list: {},
      errors: [],
      projectName: null,
      formData: {
        projectName: null,
        description: null,
        enableStaging: null
      }
    };
  },
  async mounted() {
    this.list = await this.$parent.fetch();
    if (this.$route.query.projectName) {
      this.formData._id = this.formData.projectName = this.projectName = this.$route.query.projectName;
      this.$set(this, "formData", this.list[this.projectName]);
    }
  },
  methods: {
    validate() {
      this.errors = [];
      let hasError = false;

      if (!this.formData.projectName) {
        this.errors.push("missing project name");
        hasError = true;
      }

      if (
        this.formData.projectName &&
        this.formData.projectName.match(/[\W|\s]/)
      ) {
        hasError = true;
        this.errors.push("Invalid project name  :use only [a-z] and _ letters");
      }

      this.formData._id = this.formData.projectName = this.formData.projectName.toLowerCase();
      return hasError;
    },
    async update() {
      if (this.validate()) return;
      await this.$http.put("projects", this.formData);
    },
    async create() {
      if (this.validate()) return;
      await this.$http.post("projects", this.formData);
    }
  },
  computed: {}
};
</script>
