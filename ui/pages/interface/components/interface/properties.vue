<template>
  <div>
    <h1 class="title is-4">
      properties
      <button
        @click="fetchProps"
        class="button is-primary is-small"
      >Fetch properties from data source</button>
    </h1>
    list: {{list}}
    computedValue: {{computedValue}}
  </div>
</template>
<script>
export default {
  name: "properties",
  props: ["value", "source"],
  data() {
    return { list: [] };
  },
  methods: {
    async fetchProps() {
      this.list = await this.$http.post(`interface/fetch-info`, this.source);
      this.$set(
        this.computedValue,
        "props",
        this.list.map(e => {
          return {
            name: e,
            origin: "source",
            display: true,
            transform: [],
            deltaFactor: true,
            drop: [],
            validate: [],
            statInd: false
          };
        })
      );
    }
  },
  mounted() {},
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>