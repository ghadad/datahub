<template>
  <div v-if="flowData.config">
    <div v-if="!$route.query.handler">
      <div>
        <h1 class="title">FLOW settings</h1>
        <div class="columns">
        <div class="column is-1"><label class="label">Flow name</label>
        </div>
          <div class="column is-2">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Flow uniqueue name"
                  v-model="flowData.config.name"
                  pattern="/\w+/"
                />
              </div>
            </div>
          </div>
          <div class="column is-2">
          <div class="field"><div class="control">
            <b-checkbox v-model="flowData.config.enableStaging">Enable staging</b-checkbox>
          </div>          </div>

        </div>
        </div>
        <div class="columns"
        <div class="column">
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
<pre>{{project}}</pre>
     </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "flowConfig",
  data: function() {
    return {
      deleteFlag:0,
      errors: [],
      origFlowKeyName :null ,
      flowData: {config:null},
      project: {},
    };
  },

  methods: {
    async deleteFlow(flag) {
      let self = this;
      this.deleteFlag = flag;
      if (this.deleteFlag == 2) {
      
        this.$delete(this.project.flows,this.$route.params.flow);
        
       this.$root.$once("update-project",{
         name: "explore",
         params: this.$route.params
        });
      }
      
      if (this.deleteFlag == 1) {
        setTimeout(function() {
          self.deleteFlag = 0;
        }, 3000);
      }
    }, async create() {
      if (this.project.flows[this.flowData.config.name]) {
          throw new Error(`entity ${this.flowData.config.name} already exists in this project` );
        }
      this.$set(this.project.flows,this.flowData.config.name, this.$_.cloneDeep(this.flowData));

      this.origFlowKeyName = this.flowData.config.name;
      this.$route.params.flow = this.flowData.config.name;
   
     this.$root.$once("update-project",{
        name: "flow",
        params: this.$route.params
      });
   
    },
    async update() {
        if (this.origFlowKeyName != this.flowData.config.name) {
        if (this.project.flows[this.flowData.config.name]) {
          throw new Error(`entity ${this.flowData.config.name} already exists in this project` );
        }
        this.$set(this.project.flows,this.flowData.config.name, this.$_.cloneDeep(this.flowData));
        this.$delete(this.project.flows,this.$origFlowKeyName);
        this.origFlowKeyName = this.flowData.config.name;
      }

      this.$route.params.flow = this.flowData.config.name;

      this.$root.$emit("update-project",{
        name: "flow",
        params: this.$route.params
      });
    },
  },

  async mounted() {
    this.origFlowKeyName = this.$route.params.flow;
      this.flowData = this.$parent.$data.flowData;
      this.project = this.$parent.$data.project;
      this.flowData.config = this.flowData.config ||{}
     },

beforeDestroy () {
    this.$root.$bus.$off('update-project')
 },

};
</script>