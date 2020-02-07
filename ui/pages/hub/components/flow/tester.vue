<template>
  <div v-if="collectorConfig">
    <button class="button is-link" @click="runTest">Test {{tester}}</button>
    &nbsp;<button class="button is-link" @click="runTest2">Test {{tester}} post handler</button>

    <div class="Table">
      <table class="table">
        <tr>
          <th v-for="h in headers" :key="h">{{h}}</th>
        </tr>
        <tbody>
          <tr v-if="result.length" v-for="(r,index) in result" :key="index">
            <td v-for="h in headers" :key="h">{{r[h]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    name: "test",
    data: function () {
      return {

        collectorConfig: {},
        result: []
      };
    },

    async mounted() {
      this.tester = this.$route.params.tester;
      this.collectorConfig = this.$parent.$data.flowData.collector.config;
      this.collector = this.$parent.$data.flowData.collector;

    },
    methods: {
      async runTest() {
        this.$set(this, 'result', await this.$http.post("collector/test", this.collectorConfig));
      },
      async runTest2() {
        this.$set(this, 'result', await this.$http.post("collector/test2", this.collector));
      }
    },
    computed: {
      tester: function () {
        this.$set(this, 'result', []);

        return this.$route.params.tester;
      },
      headers: function () {
        if (this.result[0]) return Object.keys(this.result[0])
        return []
      }
    },
  }
</script>