<template>
  <div v-if="handler">
    <textarea v-model="handler"></textarea>
    <button class="button is-link" @click="update">Update</button>
  </div>
</template> 
<script>
export default {
  name: "handler",
  props: ["handler"],
  data: function() {
    return {
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
