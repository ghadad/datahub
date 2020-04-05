<template>
  <div>
    <div class="columns">
      <div class="column">
        <article class="panel is-link">
          <p class="panel-heading">
            Entities
            <router-link
              :to="{name:'entity',params:{project:$route.params.project,entity:null}}"
              class="button is-pulled-right is-link is-light is-small"
            >New entity</router-link>
          </p>
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
          <p class="panel-heading">
            Flows
            <router-link
              :to="{name:'flow',params:{project:$route.params.project,flow:null}}"
              class="button is-pulled-right is-link is-light is-small"
            >New Flow</router-link>
          </p>
          <router-link
            :to="`/project/explore/${project}/flow/${f.config.name}`"
            class="panel-block"
            v-for="(f,fkey) in flows"
            :key="fkey"
          >{{f.config.name}} > {{f.collector.config.name}}</router-link>
        </article>
      </div>
      <div class="column">
        <article class="panel is-link" :class="'is-link'">
          <p class="panel-heading">
            Jobs
            <router-link
              :to="{name:'job' ,params:{project:$route.params.project,job:null}}"
              class="button is-pulled-right is-link is-light is-small"
            >New Job</router-link>
          </p>
          <router-link
            :to="`/project/explore/${project}/job/${jKey}`"
            class="panel-block"
            v-for="(j,jKey) in jobs"
            :key="jKey"
          >{{j.description}}</router-link>
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
      projectData: { entities: {}, flows: [], jobs: [] }
    };
  },
  async mounted() {
    this.$root.$emit("breadcrumbs", [
      { name: "projects" },
      { title: this.$route.params.project, active: true }
    ]);
    this.projectData = await this.$http.get(
      "projects/" + this.$route.params.project
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