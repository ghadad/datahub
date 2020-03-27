<template>
  <div v-if="jobData">
    <div class="columns">
      <div class="column is-6">
        <section>
          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">Short description</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Entity name"
                    v-model="jobData.description"
                  />
                </div>
              </div>
            </div>
            </div><div class="columns">
            <div class="column is-6">
              <div class="field">
                <div class="label">
                  <label class="label">Available flows</label>
                </div>
                      <div class="select is-fullwidth">
                        <select v-model="selectedFlow">
                          <option v-for="(flow,index) in flows" :key="index" :value="flow.config.name">{{flow.config.name}}:{{flow.config.shortDescription}}</option>
                        </select>
                </div>
              </div>
              <div class="field">
                 <button class="button is-primary" v-show="!origEntityKeyName" @click="create">Add flow to job</button>
              </div>
                            <div class="field">
                 <button class="button is-info" v-show="!origEntityKeyName" @click="create">Save</button>
              </div>
            </div>

          
    <div class="columns">
      <div class="column is-3">
        <div class="label">Name</div>
      </div>
      <div class="column is-8">
        <div class="label">Value</div>
      </div>
      <div class="column is-1"></div>
    </div>
    <div v-for="(h,index) in jobData.flows" :key="index" class="columns">
      <div class="column is-3">
        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="Entity name" v-model="h.name" pattern="/\w+/" />
          </div>
        </div>
      </div>
      <div class="column is-8">
        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="Entity name" v-model="h.value" pattern="/\w+/" />
          </div>
        </div>
      </div>
      <div class="column is-1">
        <div class="field">
          <button class="button is-danger is-small" @click="delFlow(index)">Remove</button>
        </div>
      </div>
    </div>
          </div>
        </section>
        <section>

          <div class="buttons">
            
            <button class="button is-link" v-show="origEntityKeyName" @click="update">Update</button>
            <button
              class="button is-danger"
              v-show="origEntityKeyName && deleteFlag==0"
              @click="deleteEntity(1)"
            >Delete</button>
            <button
              class="button is-danger"
              v-show="deleteFlag==1"
              @click="origEntityKeyName && deleteEntity(2)"
            >Are you sure</button>
          </div>
        </section>
      </div>
      <div class="column is-6">

      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "entity",
  components: {
  },
  data: function() {
    return {
      deleteFlag: 0,
      origEntityKeyName: null,
      project: {},
      errors: [],
      jobData: { name: null, description: null, flows: [] },
      selectedFlow:null
    };
  },
  methods: {
        delFlow(index) {
        this.jobData.flows.splice(index, 1);
      },
      addFlow() {
        this.jobData.flows.push({
          name: "",
          value: ""
        });
      },
    async deleteEntity(flag) {
      let self = this;
      this.deleteFlag = flag;
      if (this.deleteFlag == 2) {
        delete this.project.entities[this.$route.params.entity];

        await this.$saveProject(this.project, {
          name: "explore",
          params: this.$route.params
        });
      }
      if (this.deleteFlag == 1) {
        setTimeout(function() {
          self.deleteFlag = 0;
        }, 3000);
      }
    },
    async update() {
      if (this.origEntityKeyName != this.jobData.name) {
        if (this.project.entities[this.jobData.name]) {
          throw new Error(
            `entity ${this.jobData.name} already exists in this project`
          );
        }

        this.project.entities[this.jobData.name] = this.$_.cloneDeep(
          this.jobData
        );
        delete this.project.entities[this.origEntityKeyName];
        this.origEntityKeyName = this.jobData.name;
      }

      this.$route.params.entity = this.jobData.name;

      await this.$saveProject(this.project);
    },

    async create() {
      this.$set(this.project.entities, this.jobData.name, this.jobData);
      await this.$saveProject(this.project);
    }
  },
  async mounted() {
    this.origEntityKeyName = this.$route.params.entity;

    this.$root.$emit("breadcrumbs", [
      {
        name: "projects"
      },
      {
        name: "explore",
        title: this.$route.params.project
      },
      {
        title: this.$route.params.entity + "Entity",
        active: true
      }
    ]);

    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

    if (this.$route.params.entity)
      this.$set(
        this,
        "jobData",
        this.project.entities[this.$route.params.entity] || {
          properties: []
        }
      );
  },
  computed: {
    flows() {
      return this.$_.values(this.project.flows||[]);
    },
    config() {
      return window.$serverConfig;
    },
    datatypes() {
      if (this.config.dataTypes && this.jobData.dbEngine)
        return [
          { type: "" },
          ...Object.values(this.config.dataTypes[this.jobData.dbEngine])
        ];
      return [];
    },
    databases() {
      return Object.keys(this.config.dataTypes);
    }
  }
};
</script>