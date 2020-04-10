<template>
  <div>
    <section>
      <b-tabs v-model="activeTab" :multiline="true">
        <template>
          <b-tab-item label="Settings">
            <div class="columns">
              <div class="column is-2">
                <div class="field">
                  <label class="label">Interface name</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Interface name"
                      v-model="interfaceModel.interfaceName"
                      pattern="/\w+/"
                      @change="interfaceModel.interfaceName=$normalizeName(interfaceModel.interfaceName)"
                    />
                  </div>
                  <p class="help">unique name . use only alphanumeric letters</p>
                </div>
              </div>
              <div class="column is-8">
                <div class="field">
                  <label class="label">Tags</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="tags/keywords"
                      v-model="interfaceModel.tags"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="columns">
                <div class="column is-7">
                  <b-checkbox v-model="interfaceModel.active">Is interface active ?</b-checkbox>
                </div>
              </div>
              <div class="columns">
                <div class="column is-7">
                  <b-field label="Description">
                    <b-input maxlength="300" type="textarea" v-model="interfaceModel.description"></b-input>
                  </b-field>
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Source data">
            <data-source v-model="interfaceModel.source" :active="activeTab"></data-source>
          </b-tab-item>
          <b-tab-item label="Interface data props">
            <properties
              v-model="interfaceModel.properties"
              :source="interfaceModel.source"
              :active="activeTab"
            ></properties>
          </b-tab-item>
          <b-tab-item label="Output">
            <product-output v-model="interfaceModel.output" :active="activeTab"></product-output>
          </b-tab-item>
          <b-tab-item label="Notifications">
            <notifications v-model="interfaceModel.notifications" :active="activeTab"></notifications>
          </b-tab-item>
          <b-tab-item label="Jobs">
            <jobs v-model="interfaceModel.jobs" :active="activeTab"></jobs>
          </b-tab-item>
          <b-tab-item label="Help">
            <help></help>
          </b-tab-item>
        </template>
      </b-tabs>
      <div class="buttons">
        <button class="button is-primary" v-show="!$route.query.id" @click="create(true)">Create</button>
        <button class="button is-link" v-show="$route.query.id" @click="update">Update</button>
      </div>
    </section>
    <h2 class="title is-4" v-show="!$route.query.id">Set new interface</h2>
    <h2 class="title is-4" v-show="$route.query.id">Update interface : {{$route.query.id}}</h2>
    {{origInterfaceName}}: {{interfaceModel}}
  </div>
</template>
<script>
import DataSource from "./dataSource.vue";
import Properties from "./properties.vue";
import ProductOutput from "./output.vue";
import Notifications from "./notifications.vue";
import Jobs from "./jobs.vue";
import Help from "./help.vue";

export default {
  name: "upsert",
  components: {
    DataSource,
    Properties,
    ProductOutput,
    Notifications,
    Jobs,
    Help
  },
  data() {
    return {
      list: {},
      errors: [],
      activeTab: 0,
      origInterfaceName: null,
      interfaceModel: {
        interfaceName: "",
        description: "",
        source: {},
        properties: {},
        output: {},
        notifications: {},
        jobs: {}
      }
    };
  },
  async mounted() {
    if (this.$route.query.id) {
      Object.assign(
        this.interfaceModel,
        await this.$http.get("docs/interfaces/" + this.$route.query.id)
      );
      this.origInterfaceName = this.$route.query.id;
    }
  },
  methods: {
    validate() {
      this.errors = [];
      let hasError = false;
      if (!this.interfaceModel.interfaceName) {
        this.errors.push("missing interface name");
        hasError = true;
      }

      if (
        this.interfaceModel.interfaceName &&
        this.interfaceModel.interfaceName.match(/[\W|\s]/)
      ) {
        hasError = true;
        this.errors.push(
          "Invalid interface name  :use only [a-z] and _ letters"
        );
      }

      return hasError;
    },
    async update() {
      let self = this;
      if (self.validate()) return;
      self.interfaceModel._id = self.$route.query.id;
      let res1 = await this.$http.put("docs/interfaces", self.interfaceModel);
      self.interfaceModel._rev = res1.rev;
      if (self.origInterfaceName != self.interfaceModel.interfaceName) {
        let res = await self.$http.post("docs/rename", {
          db: "interfaces",
          id: res1.id,
          rev: res1.rev,
          targetId: self.interfaceModel.interfaceName
        });

        self.origInterfaceName = self.interfaceModel.interfaceName;
        self.interfaceModel._id = self.interfaceModel.interfaceName;
        self.interfaceModel._rev = res.rev;
        self.$route.query.id = self.interfaceModel.interfaceName;
      }
    },
    async create(list = true) {
      if (this.validate()) return;
      this.interfaceModel._id = this.interfaceModel.interfaceName;
      await this.$http.post("docs/interfaces", this.interfaceModel);
      this.$router.push({ name: "interfaces" });
    }
  },
  computed: {}
};
</script>
