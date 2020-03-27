<template>
  <div v-if="flowData.config">
    <div v-if="!$route.query.handler">
      <div>
        <h1 class="title is-4">FLOW settings</h1>
        <div class="columns">
          <div class="column is-2">
            <div class="field">
              <label class="label">Flow name</label>

              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Flow uniqueue name"
                  v-model="flowData.config.name"
                  @change="flowData.config.name=$normalizeName(flowData.config.name)"
                  pattern="/\w+/"
                />
              </div>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <label class="label">Target entity</label>
              <div class="select">
                <select v-model="flowData.config.targetEntity">
                  <option value>----</option>
                  <option
                    v-for="entityName in entitiesKeys"
                    :key="entityName"
                    :value="entityName"
                  >{{entityName}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="column is-3">
            <div class="field">
              <div class="control">
                <b-checkbox v-model="flowData.config.createRevisions">Create revisions collection</b-checkbox>
              </div>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <div class="control">
                <b-checkbox v-model="flowData.config.isFinalFlow">is final flow</b-checkbox>
              </div>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <div class="control">
                <b-checkbox v-model="flowData.config.enableStaging">Enable staging</b-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <b-field label="Short description">
              <b-input type="text" v-model="flowData.config.shortDescription"></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column is-8">
            <b-field label="Description">
              <b-input
                rows="6"
                maxlength="300"
                type="textarea"
                v-model="flowData.config.description"
              ></b-input>
            </b-field>
          </div>
        </div>
        <div class="column buttons-group">
          <button class="button is-primary" v-show="!$route.params.flow" @click="create">Create</button>
          <button class="button is-link" v-show="$route.params.flow" @click="update">Update</button>
          <button class="button is-danger" v-show="deleteFlag==0" @click="deleteFlow(1)">Delete</button>
          <button
            class="button is-danger"
            v-show="deleteFlag==1"
            @click="deleteFlow(2)"
          >Are you sure</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "flowConfig",
  data: function() {
    return {
      entitiesKeys: [],

      deleteFlag: 0,
      errors: [],
      origFlowKeyName: null,
      flowData: {
        config: { description: "" }
      },
      project: {}
    };
  },

  methods: {
    async deleteFlow(flag) {
      let self = this;
      this.deleteFlag = flag;
      if (this.deleteFlag == 2) {
        let itemIndex = this.$_.findIndex(
          this.project.flows,
          e => e.config.name == this.$route.params.flow
        );
        this.project.flows.splice(itemIndex, 1);

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
    async create() {
      this.project.flows.push(this.$_.cloneDeep(this.flowData));
      this.origFlowKeyName = this.flowData.config.name;
      this.$route.params.flow = this.flowData.config.name;

      await this.$saveProject(this.project);
    },
    async update() {
      if (this.origFlowKeyName != this.flowData.config.name) {
        if (this.project.flows[this.flowData.config.name]) {
          throw new Error(
            `entity ${this.flowData.config.name} already exists in this project`
          );
        }
        this.$set(
          this.project.flows,
          this.flowData.config.name,
          this.$_.cloneDeep(this.flowData)
        );
        this.$delete(this.project.flows, this.$origFlowKeyName);
        this.origFlowKeyName = this.flowData.config.name;
      }

      this.$route.params.flow = this.flowData.config.name;

      await this.$saveProject(this.project);
    }
  },

  async mounted() {
    this.origFlowKeyName = this.$route.params.flow;
    this.flowData = this.$parent.$data.flowData;
    this.project = this.$parent.$data.project;
    this.flowData.config = this.flowData.config || {};
    this.entitiesKeys = Object.keys(this.$parent.$data.project.entities);
  }
};
</script>