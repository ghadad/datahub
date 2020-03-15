<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <router-link class="button is-link" :to="{name:'upsertSql'}">New Sql statement</router-link>
      </div>
    </div>
    <table class="table is-borderd is-fullwidth">
      <thead>
        <th>sql id</th>
        <th>Description</th>
        <th>is prefetch ?</th>
        <th>Actions</th>
      </thead>
      <tbody v-show="list.length==0">
        <th colspan="4">No sql statements found</th>
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
                :to="{name:'upsertSql',query:{id:d._id}}"
              >Update</router-link>
              <button
                class="button is-danger"
                v-show="!sqlsToDelete[d._id]"
                @click="deleteSql(d,index)"
              >Delete</button>
              <button
                class="button is-danger"
                v-show="sqlsToDelete[d._id]"
                @click="deleteSql(d,index)"
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
  name: "sqls",
  data: function() {
    return {
      sqlsToDelete: {},
      list: []
    };
  },
  methods: {
    async deleteSql(d, index) {
      if (this.sqlsToDelete[d._id]) {
        await this.$http.delete("sqls", { id: d._id, rev: d._rev });
        this.list.splice(index, 1);
        return;
      }

      this.$set(this.sqlsToDelete, d._id, true);
      setTimeout(() => this.$set(this.sqlsToDelete, d._id, false), 3000);
    },
    async fetch() {
      this.$set(this, "list", await this.$http.get("sqls"));
    }
  },
  async mounted() {
    await this.fetch();
  }
};
</script>
