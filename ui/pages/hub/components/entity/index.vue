<template>
  <div v-if="entityData.name">
    <h1>Entity & Properties</h1>
      <div class="columns">
      <div class="column">
        <p v-for="(e,index) in errors" :key="index" class="has-text-danger">{{e}}</p>
      </div>
    </div>

    <div class="columns">
      <div class="column is-6">
      <div class="column is-3">
        <div class="field">
          <label class="label">Entity name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="formData.entityName" 
              pattern="/\w+/"
            />
          </div>

          <p class="help">unique name . use only alphanumeric letters</p>

          <p v-for="(e,index) in errors" :key="index">{{e}}</p>
          </div>
        </div>
              <div class="column is-12">
          <b-field label="Description">
            <b-input maxlength="300" type="textarea" v-model="formData.description"></b-input>
          </b-field>
        </div> 
      </div>
        <div class="column is-6">
          <h2>Properties : <button class="button is-light">Add property</button></h2>
      </div>
    </div>
    <div>
    
      <div class="buttons">
        <button class="button is-primary" v-show="!entityName" @click="create">Create</button>
        <button class="button is-link" v-show="entityName" @click="update">Update</button>
      </div>
    </div>
    <b-message title="params" type="is-info">{{$route.params}}</b-message>
    <b-message title="entityData" type="is-info">{{entityData}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "entity",
  data: function() {
    return {
      formData:{entityName:null,description:null,},
      entityData: {},
      initEntuty:{}
    };
  },
  async mounted() {
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );
    this.entityData = project.entities[this.$route.params.entity] || {};
  }
};
</script>
