<template>
  <div>
    <h1>Databases</h1>
    <table class="table">
      <tbody>
        <tr>
          <th>Client</th>
        </tr>
      </tbody>
    </table>
    {{list}}
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
  async mounted() {
    let res = await this.$http.get("databases");
    this.list = res.data;
  }
};
</script>