<template>
  <div>
    <h2 class="title is-4" v-show="!$route.query.id">Set new project</h2>
    <h2 class="title is-4" v-show="$route.query.id">Update project : {{$route.query.id}}</h2>
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
              @change="project.projectName=$normalizeName(project.projectName)"
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
          <b-checkbox v-model="project.active">Is project active ?</b-checkbox>
        </div>
      </div>
      <div class="columns">
        <div class="column is-7">
          <b-field label="Description">
            <b-input maxlength="300" type="textarea" v-model="project.description"></b-input>
          </b-field>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" v-show="!$route.query.id" @click="create(true)">Create</button>
        <button class="button is-link" v-show="$route.query.id" @click="update">Update</button>
      </div>
    </div>
    {{origProjectName}}: {{project}}
  </div>
</template>
<script>
export default {
  name: "upsert",
  data() {
    return {
      list: {},
      errors: [],
      origProjectName: null,
      project: {
        projectName: null,
        description: null,
        generated: null,
        flows: [],
        entities: {},
        jobs: []
      }
    };
  },
  async mounted() {
    if (this.$route.query.id) {
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
      return hasError;
    },
    async update() {
      let self = this;
      if (self.validate()) return;
      self.project._id = self.origProjectName;
      let res = await this.$saveProject(self.project);
      if (self.origProjectName != self.project.projectName) {
        let res = await self.$http.post("docs/rename", {
          db: "projects",
          id: self.origProjectName,
          rev: self.project._rev,
          targetId: self.project.projectName
        });

        self.origProjectName = self.project.projectName;
        self.project._id = self.project.projectName;
        self.project._rev = res.rev;
        self.$route.query.id = self.project.projectName;
      }
    },
    async create(list = true) {
      if (this.validate()) return;
      this.project._id = this.project.projectName;
      await this.$createProject(this.project, list ? { name: "projects" } : {});
    }
  },
  computed: {}
};
</script>
