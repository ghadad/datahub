<template>
  <div>
    <div class="columns">
      <div class="column">
        <article class="panel is-link">
          <p class="panel-heading">Entities</p>
          <router-link
            :to="`/project/explore/${project}/entity/${eKey}`"
            class="panel-block"
            v-for="(e,eKey) in entities"
            :key="eKey"
          >{{e.name}}</router-link>
        </article>
      </div>
      <div class="column">
        <article class="panel is-link">
          <p class="panel-heading">Flows</p>
          <router-link
            :to="`/project/explore/${project}/flow/${fkey}`"
            class="panel-block"
            v-for="(f,fkey) in flows"
            :key="fkey"
          >{{f.collector.config.name}}</router-link>
        </article>
      </div>
      <div class="column">
        <article class="panel is-link" :class="'is-link'">
          <p class="panel-heading">Jobs</p>
          <router-link
            :to="`/project/explore/${project}/job/${jKey}`"
            class="panel-block"
            v-for="(j,jKey) in jobs"
            :key="jKey"
          >{{j.name}}</router-link>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "explore",
  data: function() {
    return {
      projectData: { entities: {}, flows: {}, jobs: {} }
    };
  },
  async mounted() {
    this.projectData = this.$dj(
      await this.$http.get("projects/" + this.$route.params.project)
    );
  },
  computed: {
    project() {
      return this.$route.params.project;
    },
    entities() {
      return this.projectData.entities;
    },
    flows() {
      return this.projectData.flows;
    },
    jobs() {
      return this.projectData.jobs;
    }
  }
};
</script>