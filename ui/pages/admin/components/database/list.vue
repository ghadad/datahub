<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>DB Alias</th>
          <th>Client</th>
          <th>Hostname</th>
          <th>User</th>
          <th>Password</th>
          <th>Port</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d,index) in list" :key="d._id">
          <td>{{d._id}}</td>
          <td>{{d.db.client}}</td>
          <td>{{d.db.connection.host}}</td>
          <td>{{d.db.connection.user}}</td>
          <td>{{d.db.connection.password}}</td>
          <td>{{d.db.connection.port}}</td>
          <td>
            <div class="buttons">
              <button class="button is-info" @click="update(d.db._id)">Update</button>
              <button class="button is-danger" @click="deleteDb(d)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "databases-list",
  data() {
    return {
      list: []
    }; 
  },
  methods: {
    async deleteDb(doc) {
      await this.$http.delete("databases", { id: doc._id,rev: doc._rev });
       this.list = await this.$parent.fetch();
    },
    update(id) {
      this.$router.push({
        path: "/database/upsert",
        query: { dbAlias: id }
      });
    }
  },
  async mounted() {
    this.list = await this.$parent.fetch();
  }
};
</script>