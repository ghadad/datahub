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
              v-model="project.projectName"
              pattern="/\w+/"
            />
          </div>

          <p class="help">unique name . use only alphanumeric letters</p>

          <p v-for="(e,index) in errors.projectName" :key="index">{{e}}</p>
        </div>
      </div>
      <div class="column is-2" v-show="!this.$route.query.id">
        <div class="field">
          <b-checkbox v-model="project.generated">Grab example data</b-checkbox>
        </div>
      </div>
    </div>
    <div>
      <div class="columns">
        <div class="column is-7">
          <b-field label="Description">
            <b-input maxlength="300" type="textarea" v-model="project.description"></b-input>
          </b-field>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" v-show="!$route.query.id" @click="create">Create</button>
        <button class="button is-link" v-show="$route.query.id" @click="update">Update</button>
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
      origProjectName:null,
      project: {
        projectName: null,
        description: null,
        generated: null,
        flows:{},
        entities:{},
        jobs:{}
      }
    };
  },
  async mounted() {
    if (this.$route.query.id){

      this.project = await this.$http.get("projects/" + this.$route.query.id);
      this.origProjectName = this.$route.query.id;
    }
  },
  methods: {
    validate() {
      this.errors = [];
      let hasError = false;

      if (!this.project.projectName) {
        this.errors.push("missing project name");
        hasError = true;
      }

      if (
        this.project.projectName &&
        this.project.projectName.match(/[\W|\s]/)
      ) {
        hasError = true;
        this.errors.push("Invalid project name  :use only [a-z] and _ letters");
      }

      //      this.project._id = this.project.projectName = this.project.projectName.toLowerCase();
      this.project._id = this.project.projectName = this.project.projectName.toLowerCase();
      return hasError;
    },
    async update() {
      let self = this;
      if (this.validate()) return;
      
        if (self.origProjectName != self.project.projectName) {
          let origId = self.project._id;
          let origRev = self.project._rev;
          self.project._rev=null;
          delete self.project._rev;
          await self.create(false);
          await self.$http.delete("projects", { id: self.origProjectName, rev: origRev });
        } else {
          await this.$saveProject(self.project);
        }

    },
    async create(list=true) {
      if (this.validate()) return;

      await this.$createProject(this.project, this.project.generated, list ? { name: "projects" }:{});
    }
  },
  computed: {}
};
</script>
