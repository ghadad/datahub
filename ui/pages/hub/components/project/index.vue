<template>
  <div>
    <div class="tabs">
      <ul>
        <li v-for="m in menu" :key="m.title" :class="m.link==$route.path ?'is-active':''">
          <router-link :to="{path:m.link}">{{m.title}}</router-link>
        </li>
      </ul>
    </div>
    <div>
      <router-view></router-view>
    </div>
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
          title: "Projects",
          link: "/project/list"
        },
        {
          title: "Edit/create Project",
          link: "/project/upsert"
        },
        {
          title: "Help",
          link: "/project/help"
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
    let self = this;
     this.$root.$emit("breadcrumbs",[]);
    this.list = await this.fetch();
    //this.$router.push("/project/list");
  }
};
</script>
