<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <router-link class="button is-link" :to="{name:'upsertDataset'}">New dataset</router-link>
      </div>
    </div>
    <table class="table is-borderd is-fullwidth">
      <thead>
        <th>Dataset id</th>
        <th>Description</th>
        <th>is prefetch ?</th>
        <th>Actions</th>
      </thead>
      <tbody v-show="list.length==0">
        <th colspan="4">No datasets found</th>
      </tbody>
      <tbody>
        <tr v-for="(d,index) in list" :key="index">
          <td>{{d._id}}</td>
          <td>{{d.description}}</td>
          <td>{{d.prefetch}}</td>
          <td>
            <div class="buttons">
              <router-link
                class="button is-info"
                :to="{name:'upsertDataset',query:{id:d._id}}"
              >Update</router-link>
              <button
                class="button is-danger"
                v-show="!datasetsToDelete[d._id]"
                @click="deleteDataset(d,index)"
              >Delete</button>
              <button
                class="button is-danger"
                v-show="datasetsToDelete[d._id]"
                @click="deleteDataset(d,index)"
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
  name: "datasets",
  data: function() {
    return {
      datasetsToDelete: {},
      list: []
    };
  },
  methods: {
    async deleteDataset(d, index) {
      if (this.datasetsToDelete[d._id]) {
        await this.$http.delete("datasets", { id: d._id, rev: d._rev });
        this.list.splice(index, 1);
        return;
      }

      this.$set(this.datasetsToDelete, d._id, true);
      setTimeout(() => this.$set(this.datasetsToDelete, d._id, false), 3000);
    },
    async fetch() {
      this.$set(this, "list", await this.$http.get("datasets"));
    }
  },
  async mounted() {
    await this.fetch();
  }
};
</script>
