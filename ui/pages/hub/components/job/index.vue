<template>
  <div v-if="jobData.name">
    <h1>jobData & scheduling</h1>
    <div class="control">
      <input
        class="input"
        type="text"
        placeholder="Entity name"
        v-model="jobData.name"
        pattern="/\w+/"
      />
    </div>
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
    let project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );

    this.jobData = project.jobs[this.$route.params.job];
  }
};
</script>
