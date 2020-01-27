<template>
  <div v-if="entityData">
    <h1 class="title">Entity & Properties</h1>
    <div class="columns">
      <div class="column is-6">
        <section>
          <div class="field">
            <label class="label">Entity name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Entity name" v-model="entityData.name" pattern="/\w+/" />
            </div>
            <p class="help">unique name . use only alphanumeric letters</p>
            <p v-for="(e,index) in errors" :key="index">{{e}}</p>
          </div>
        </section>
        <section>
          <b-field label="Description">
            <b-input rows="20" maxlength="300" type="textarea" v-model="entityData.description"></b-input>
          </b-field>
        </section>
      </div>
      <div class="column is-6">
        <properties ref="properties" v-if="entityData.properties" :list="entityData.properties"></properties>
      </div>
    </div>
    <div>
      <div class="buttons">
        <button class="button is-primary" v-show="!entityData.name" @click="create">Create</button>
        <button class="button is-link" v-show="entityData.name" @click="update">Update</button>
        <button class="button is-danger" v-show="deleteFlag==0" @click="deleteEntity(1)">Delete</button>
        <button class="button is-danger" v-show="deleteFlag==1" @click="deleteEntity(2)">Are you sure</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Properties from "./properties";
  export default {
    name: "entity",
    components: {
      Properties
    },

    data: function () {
      return {
        deleteFlag: 0,
        origEntityKeyName: null,
        project: null,
        errors: [],
        initEntuty: {
          name: null,
          description: null,
          properties: []
        },
        entityData: {}
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
          setTimeout(function () {
            self.deleteFlag = 0;
          }, 3000);
        }
      },
      async update() {
        this.$set(
          this.entityData,
          "properties",
          this.$refs.properties.properties
        );

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
                        
          await this.$saveProject(this.project,{
                    name: "entity",
                  params: this.$route.params
                });
              },

      create() {
        this.$set(
          this.entityData,
          "properties",
          this.$refs.properties.properties
        );
      }
    },
    async mounted() {
      this.origEntityKeyName = this.$route.params.entity;

      this.$root.$emit("breadcrumbs", [{
          name: "projects"
        },
        {
          name: "explore",
          title: this.$route.params.project
        },
        {
          title: this.$route.params.entity + " Entity",
          active: true
        }
      ]);
      this.project = await this.$http.get(
        `projects/${this.$route.params.project}`
      );

      this.$set(
        this,
        "entityData",
        this.project.entities[this.$route.params.entity] || {
          properties: []
        }
      );
    }
  };
</script>