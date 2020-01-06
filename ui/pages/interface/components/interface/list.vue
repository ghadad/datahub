<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Project name</th>
          <th>Description</th>
          <th>version</th>
          <th>Enable staging</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="Object.values(list).length==0">
        <th colspan="4" class="has-border-dark">No projects found on server</th>
      </tbody>
      <tbody>
        <tr v-for="(p,projectName) in list" :key="projectName">
          <td>{{projectName}}</td>
          <td>{{p.description}}</td>
          <td>{{p.version}}</td>
          <td>{{p.enableStaging}}</td>
          <td>
            <div class="buttons">
              <button class="button is-primary" @click="explore(projectName)">Explore</button>
              <button class="button is-info" @click="update(projectName,p)">Update</button>
              <button class="button is-danger" @click="deleteDb(projectName)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "interfaces-list",
  data() {
    return {
      list: {}
    };
  },
  methods: {
    async deleteDb(projectName) {
      await this.$http.delete("projects", { projectName: projectName });
      this.list = await this.$parent.fetch();
    },
    explore(projectName) {
      this.$router.push({
        path: `/project/explore/${projectName}`
      });
    },
    update(projectName) {
      this.$router.push({
        path: "/project/upsert",
        query: { projectName: projectName }
      });
    }
  },
  async mounted() {
    this.list = await this.$parent.fetch();
  }
};
</script>