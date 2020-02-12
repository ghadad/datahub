<template>
  <div>
    <h2>
      <router-link
        :to="{name:'flow',params:{project:$route.params.project,flow:null}}"
        class="button is-pulled-right is-link is-light is-medium"
      >New Flow</router-link>
    </h2>
    <div class="columns is-multiline">
      <div class="column is-3" v-for="(e,eKey) in flows" :key="eKey">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              <router-link :to="`/project/explore/${project}/flow/${eKey}`">{{e.config.name}}</router-link>
            </p>
          </header>
          <div class="card-content">
            <div class="content">{{e.config.description}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "flows",
  data: function() {
    return {
      projectData: { flows: {} }
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
    flows() {
      return this.projectData.flows;
    }
  }
};
</script>