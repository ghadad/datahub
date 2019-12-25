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
        <tr v-for="(d,dbAlias) in list" :key="dbAlias">
          <td>{{dbAlias}}</td>
          <td>{{d.client}}</td>
          <td>{{d.connection.host}}</td>
          <td>{{d.connection.user}}</td>
          <td>{{d.connection.password}}</td>
          <td>{{d.connection.port}}</td>
          <td>
            <div class="buttons">
              <button class="button is-info" @click="update(dbAlias,d)">Update</button>
              <button class="button is-danger" @click="deleteDb(dbAlias)">Delete</button>
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
    async deleteDb(dbAlias) {
      await this.$http.delete("databases", { dbAlias: dbAlias });
       this.list = await this.$parent.fetch();
    },
    update(dbAlias) {
      this.$router.push({
        path: "/database/upsert",
        query: { dbAlias: dbAlias }
      });
    }
  },
  async mounted() {
    this.list = await this.$parent.fetch();
  }
};
</script>