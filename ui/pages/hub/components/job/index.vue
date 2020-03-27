<template>
  <div v-if="jobData">
    <div class="columns">
      <div class="column is-5">
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
        <div class="field">
          <div class="label">
            <label class="label">Available flows</label>
          </div>
          <div class="select is-fullwidth">
            <select v-model="selectedFlow">
              <option
                v-for="(flow,index) in availableFlows"
                :key="index"
                :value="flow.config.name"
                v-show="!checkDisable(flow.config.name)"
              >{{flow.config.name}}:{{flow.config.shortDescription}}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <button class="button is-primary" v-show="!origEntityKeyName" @click="add">Add flow to job</button>
        </div>
        <div class="field">
          <button class="button is-info" v-show="!origEntityKeyName" @click="create">Save</button>
        </div>
      </div>
    </div>

    <div>{{jobData}}</div>
  </div>
</template>

<script>
export default {
  name: "entity",
  components: {},
  data: function() {
    return {
      deleteFlag: 0,
      project: { flows: [] },
      errors: [],
      jobData: { flows: [] },
      selectedFlow: null
    };
  },
  methods: {
    checkDisable(flow) {
      return this.jobData.flows.find(e => e == flow);
    },
    delFlow(index) {
      this.jobData.tasks.splice(index, 1);
    },
    add(flow) {
      this.jobData.flows.push(this.selectedFlow);
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
    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

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
  },
  computed: {
    availableFlows() {
      return this.project.flows || [];
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