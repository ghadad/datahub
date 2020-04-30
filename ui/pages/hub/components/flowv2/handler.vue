<template>
  <div v-if="handler">
    <codemirror v-model="handler" :options="cmOptions"></codemirror>

    <button class="button is-link" @click="update">Update</button>
  </div>
</template> 
<script>
export default {
  name: "handler",
  props: ["handler"],
  data: function() {
    return {
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      functions: null,
      route: null,
      entity: {}
    };
  },
  methods: {
    update() {
      this.$root.$emit("update-project");
    }
  },
  async mounted() {}
};
</script>
