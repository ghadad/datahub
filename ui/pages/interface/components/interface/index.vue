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
          link: "/interface/list"
        },
        {
          title: "Edit/create interface",
          link: "/interface/upsert"
        },
        {
          title: "Help",
          link: "/interface/help"
        }
      ]
    };
  },
  methods: {
    async fetch() {
      return await this.$http.get("interfces");
    }
  },
  async mounted() {
    this.list = await this.fetch();
    this.$router.push("/interfce/list");
  }
};
</script>
