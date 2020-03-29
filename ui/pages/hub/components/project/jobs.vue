<template>
  <div>
    <h2>
      <router-link
        :to="{name:'job',params:{project:$route.params.project,job:null}}"
        class="button is-pulled-right is-link is-light is-medium"
      >New job</router-link>
    </h2>
    <div class="columns is-multiline">
      <div class="column is-3" v-for="(e,eKey) in jobs" :key="eKey">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <router-link :to="`/project/explore/${project}/job/${eKey}`">{{e.description}}</router-link>
            </p>
          </header>
          <div class="card-content">
            <div class="content">{{e.description}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "entities",
  data: function() {
    return {
      projectData: { jobs: [] }
    };
  },
  async mounted() {
    this.$root.$emit("breadcrumbs", [
      { name: "projects", title: this.$route.params.project },
      { title: "entities", active: true }
    ]);
    this.projectData = await this.$http.get(
      "projects/" + this.$route.params.project
    );
  },
  computed: {
    project() {
      return this.$route.params.project;
    },
    jobs() {
      return this.projectData.jobs;
    }
  }
};
</script>