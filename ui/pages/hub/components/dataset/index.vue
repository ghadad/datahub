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
  name: "database",
  data: function() {
    return {
      list: [],
      menu: [
        {
          title: "Databases",
          link: "/datasets/list"
        },
        {
          title: "Edit/create Database",
          link: "/database/upsert"
        },
        {
          title: "Help",
          link: "/database/help"
        }
      ]
    };
  },
  methods: {
    async fetch() {
      return await this.$http.get("databases");
    }
  },
  async mounted() {
    this.list = await this.fetch();
    this.$router.push({name:"datasetsList"});
  }
};
</script>
