<template>
  <div v-if="entityData">
    <div class="columns">
      <div class="column is-4">
        <section>
          <div class="columns">
            <div class="column is-8">
              <div class="field">
                <label class="label">Entity name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Entity name"
                    v-model="entityData.name"
                    pattern="/\w+/"
                    @change="entityData.name=$normalizeName(entityData.name)"
                  />
                </div>
                <p class="help">unique name . use only alphanumeric letters</p>
              </div>
            </div>
            <div class="column is-5">
              <div class="field">
                <div class="label">
                  <label class="label">Target Database engine</label>
                </div>
                <div class="field-body">
                  <div class="field is-narrow">
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select
                          v-model="entityData.dbEngine"
                          :disabled="entityData.properties.length?true:false"
                        >
                          <option v-for="(db,index) in databases" :key="index" :value="db">{{db}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <b-field label="Description">
            <b-input rows="10" maxlength="300" type="textarea" v-model="entityData.description"></b-input>
          </b-field>
          <div class="buttons">
            <button class="button is-primary" v-show="!origEntityKeyName" @click="create">Create</button>
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
      <div class="column is-7">
        <properties
          ref="properties"
          v-if="entityData.properties"
          :list.sync="entityData.properties"
          :datatypes="datatypes"
        ></properties>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import Properties from "./properties";
export default {
  name: "entity",
  components: {
    Properties
  },
  data: function() {
    return {
      deleteFlag: 0,
      origEntityKeyName: null,
      project: null,
      errors: [],
      entityData: { name: null, description: null, properties: [] }
    };
  },
  methods: {
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
      if (this.origEntityKeyName != this.entityData.name) {
        if (this.project.entities[this.entityData.name]) {
          throw new Error(
            `entity ${this.entityData.name} already exists in this project`
          );
        }

        this.project.entities[this.entityData.name] = this.$_.cloneDeep(
          this.entityData
        );
        delete this.project.entities[this.origEntityKeyName];
        this.origEntityKeyName = this.entityData.name;
      }

      this.$route.params.entity = this.entityData.name;

      await this.$saveProject(this.project);
    },

    async create() {
      this.$set(this.project.entities, this.entityData.name, this.entityData);
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
        "entityData",
        this.project.entities[this.$route.params.entity] || {
          properties: []
        }
      );
  },
  computed: {
    config() {
      return this.$sysConfig;
    },
    datatypes() {
      if (this.config.dataTypes && this.entityData.dbEngine)
        return [
          { type: "" },
          ...Object.values(this.config.dataTypes[this.entityData.dbEngine])
        ];
      return [];
    },
    databases() {
      return Object.keys(this.config.dataTypes);
    }
  }
};
</script>
