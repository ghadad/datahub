<template>
  <div v-if="entityData.name">
    <h1>Entity & Properties</h1>
    <b-message title="params" type="is-info">{{$route.params}}</b-message>
    <b-message title="entityData" type="is-info">{{entityData}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "entity",
  data: function() {
    return {
      entityData: {}
    };
  },
  async mounted() {
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );
    this.entityData = project.entities[this.$route.params.entity];
  }
};
</script>
