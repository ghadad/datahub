<template>
  <div>
      <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "project",
  data: function() {
    return {
      list: [],
      menu: [
       
        {
          title: "Edit/create Project",
          link: "/project/upsert"
        }
      ]
    };
  },
  methods: {
    async fetch() {
      return await this.$http.get("projects");
    }
  },
  async mounted() {
    
     this.$root.$emit("breadcrumbs",[]);
    this.list = await this.fetch();
    //this.$router.push("/project/list");
  }
};
</script>
