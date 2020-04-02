<template>
  <div v-if="flowData.config">
    <div>
      <div class="columns">
        <div class="column is-5">
          <h1 class="title is-5">
            Flow settings
            <b-checkbox v-model="flowData.config.active" class="is-pulled-right">is flow active ?</b-checkbox>
          </h1>
        </div>
      </div>
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
            <b-input rows="6" maxlength="300" type="textarea" v-model="flowData.config.description"></b-input>
          </b-field>
        </div>
      </div>
      <div class="column buttons-group">
        <button class="button is-primary" v-show="!$route.params.flow" @click="create">Create</button>
        <button class="button is-link" v-show="$route.params.flow" @click="update">Update</button>
        <button class="button is-danger" v-show="deleteFlag==0" @click="deleteFlow(1)">Delete</button>
        <button class="button is-danger" v-show="deleteFlag==1" @click="deleteFlow(2)">Are you sure</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "flowConfig",
  data: function() {
    return {
      otherFlows: [],
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
    checkUnique(flow) {
      //alert(this.flowData.config.name + ":" + this.otherFlows.join(","));
      //  alert(this.$_.includes(this.otherFlows, this.flowData.config.name));
      if (this.$_.includes(this.otherFlows, this.flowData.config.name))
        throw new Error(
          `Flow name : ${this.flowData.config.name} is already registerd`
        );
    },
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
      this.checkUnique();

      this.project.flows.push(this.$_.cloneDeep(this.flowData));
      this.$route.params.flow = this.flowData.config.name;
      this.$route.params.project = this.flowData.config.name;
      await this.$saveProject(this.project, {
        name: "flowConfig",
        params: { project: this.project._id, flow: this.flowData.config.name }
      });
    },
    async update() {
      this.checkUnique();
      await this.$saveProject(this.project);
    }
  },

  async mounted() {
    this.project = this.$parent.$data.project;
    this.otherFlows = this.$_.cloneDeep(
      this.project.flows
        .filter(f => f.config.name != this.$route.params.flow)
        .map(f => f.config.name)
    );
    this.origFlowKeyName = this.$route.params.flow;
    this.flowData = this.$parent.$data.flowData;

    this.flowData.config = this.flowData.config || {};
    this.entitiesKeys = Object.keys(this.$parent.$data.project.entities);
  }
};
</script>