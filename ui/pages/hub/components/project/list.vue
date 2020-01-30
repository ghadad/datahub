<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Project name</th>
          <th>Description</th>
          <th>version</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="Object.values(list).length==0">
        <th colspan="4" class="has-border-dark">
          No projects found !
          <router-link
            :to="{name:'projectUpsert'}"
            class="button is-info is-small"
            @click="update"
          >Create new project</router-link>
        </th>
      </tbody>
      <tbody>
        <tr v-for="(p,index) in list" :key="p._id">
          <td>{{p._id}}</td>
          <td>{{p.description}}</td>
          <td>{{p.version}}</td>
          <td>
            <div class="buttons">
              <button class="button is-primary" @click="explore(p._id)">Explore</button>
              <button class="button is-info" @click="update(p)">Update</button>
              <button
                class="button is-danger"
                v-show="!projectsToDelete[p._id]"
                @click="deleteProject(p)"
              >Delete</button>
              <button
                class="button is-danger"
                v-show="projectsToDelete[p._id]"
                @click="deleteProject(p)"
              >Are you sure ?</button>
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
      list: {},
      deleteStep: 1,
      projectsToDelete: {}
    };
  },
  methods: {
    async deleteProject(p) {
      if (this.projectsToDelete[p._id]) {
        await this.$http.delete("projects", { id: p._id, rev: p._rev });
        this.list = await this.$parent.fetch();
        return;
      }

      this.$set(this.projectsToDelete, p._id, true);
      setTimeout(() => this.$set(this.projectsToDelete, p._id, false), 3000);
    },

    explore(id) {
      this.$router.push({
        path: `/project/explore/${id}`
      });
    },
    update(p) {
      this.$router.push({
        path: "/project/upsert",
        query: { id: p._id }
      });
    }
  },
  async mounted() {
    this.list = await this.$parent.fetch();
  }
};
</script>