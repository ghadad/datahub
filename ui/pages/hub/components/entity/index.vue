<template>
  <div v-if="entityData">
    <h1>Entity & Properties</h1>
    <div class="columns">
      <div class="column">
        <p v-for="(e,index) in errors" :key="index" class="has-text-danger">{{e}}</p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-5">
        <div class="columns">
          <div class="column is-5">
            <div class="field">
              <label class="label">Entity name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Entity name"
                  v-model="entityData.name"
                  pattern="/\w+/"
                />
              </div>
              <p class="help">unique name . use only alphanumeric letters</p>
              <p v-for="(e,index) in errors" :key="index">{{e}}</p>
            </div>
          </div>
          <div class="column is-5">
            <div class="field">
              <label class="label">Entity name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Entity name"
                  v-model="entityData.name"
                  pattern="/\w+/"
                />
              </div>
              <p class="help">unique name . use only alphanumeric letters</p>

              <p v-for="(e,index) in errors" :key="index">{{e}}</p>
            </div>
          </div>
        </div>
        <div class="column is-12">
          <b-field label="Description">
            <b-input maxlength="300" type="textarea" v-model="entityData.description"></b-input>
          </b-field>
        </div>
      </div>
      <div class="column is-6">
        <properties ref="properties" v-if="entityData.properties" :list="entityData.properties"></properties>
      </div>
    </div>
    <div>
      <div class="buttons">
        <button class="button is-primary" v-show="!entityData.name" @click="create">Create</button>
        <button class="button is-link" v-show="entityData.name" @click="update">Update</button>
      </div>
    </div>
  </div>
</template> 
<script>
import Properties from "./properties";
export default {
  name: "entity",
  components: { Properties },
  methods: {
    create() {},
    update() {}
  },
  data: function() {
    return {
      errors: [],
      initEntuty: { name: null, description: null, properties: [] },
      entityData: {}
    };
  },
  methods: {
    update() {
      this.$set(
        this.entityData,
        "properties",
        this.$refs.properties.properties
      );
    },
    create() {
      this.$set(this.entityData.properties, this.$refs.properties.properties);
    }
  },
  async mounted() {
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );

    this.$set(
      this,
      "entityData",
      project.entities[this.$route.params.entity] || {}
    );
  }
};
</script>
