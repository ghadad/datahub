<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "interface",
  data: function() {
    return {
      list: [],
      menu: [
        {
          title: "Edit/create Interface",
          link: "/interface/upsert"
        }
      ]
    };
  },
  methods: {
    async fetch() {
      return await this.$http.get("/docs/interfaces");
    }
  },
  async mounted() {
    this.$root.$emit("breadcrumbs", []);
    this.list = await this.fetch();
    //this.$router.push("/interface/list");
  }
};
</script>
