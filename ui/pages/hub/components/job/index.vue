<template>
  <div v-if="jobData.name">
    <h1>jobData & scheduling</h1>
    <b-message title="params" type="is-info">{{$route.params}}</b-message>
    <b-message title="jobData" type="is-info">{{jobData}}</b-message>
  </div>
</template> 
<script>
export default {
  name: "entity",
  data: function() {
    return {
      jobData: {}
    };
  },
  async mounted() {
    let project = this.$dj(
      await this.$http.get(`projects/${this.$route.params.project}`)
    );
    this.jobData = project.jobs[this.$route.params.job];
  }
};
</script>
