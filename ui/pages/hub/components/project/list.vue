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
        <tr v-for="(p,index) in list" :key="p._id">
          <td>{{p._id}}</td>
          <td>{{p.description}}</td>
          <td>{{p.version}}</td>
          <td>{{p.enableStaging}}</td>
          <td>
            <div class="buttons">
              <button class="button is-primary" @click="explore(p._id)">Explore</button>
              <button class="button is-info" @click="update(p)">Update</button>
              <button class="button is-danger" @click="deleteDb(_id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "projects-list",
  data() {
    return {
      list: {}
    };
  },
  methods: {
    async deleteDb(_id) {
      await this.$http.delete("projects", { _id: _id });
      this.list = await this.$parent.fetch();
    },
    explore(id) {
      this.$router.push({
        path: `/project/explore/${id}`
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