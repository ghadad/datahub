<template>
  <div class>
    <h1 class="h1 title">Base Configuration</h1>
    <pre>{{serverConfig}}</pre>
  </div>
</template> 

<script>
export default {
  name: "Home",
  props: {
    msg: String
  },
  data() {
    return {
      conf: null
    };
  },
  mounted() {
    setTimeout(() => (this.conf = window.$serverConfig), 500);
  },
  computed: {
    serverConfig: {
      get() {
        return this.conf;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
