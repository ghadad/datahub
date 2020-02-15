<template>
  <div  ref="a1" class="columns is-fullwidth" style="width:100%''">
    <div ref="a2"  class="column is-12 scrollx" :style="'min-width:'+width +'px'">
      <button class="button is-link" @click="runTest(tester)">Test {{tester}}</button>
      &nbsp;
      <button
        class="button is-link"
        @click="runTest(tester+'_handler')"
      >Test {{tester}} post handler</button>
      <b-notification v-show="error" :closable="false" type="is-danger" class="error">{{error}}</b-notification>
      <h3 class="title is-4">{{testerTitle}} result</h3>
      <div class="">
      <table v-if="result.length" class="table result table-bordered table-striped">
        <tr>
          <th v-for="h in headers" :key="h">{{h}}</th>
        </tr>
        <tbody>
          <tr  v-for="(r,index) in result" :key="index">
            <td v-for="h in headers" :key="h">{{r[h]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
     </div>
  </div>
</template>
<script>
export default {
  name: "test",
  data: function() {
    return {
      testerTitle: null,
      error: null,
      flow: {},
      result: [],
      width:1000
    };
  },

  async mounted() {
    this.tester = this.$route.params.tester;
    this.flow = this.$parent.$data.flowData;
     this.width = this.$refs.a1.clientWidth ;
  },
  methods: {
    async runTest(tester) {
       this.$set(this, "result", []);
      this.testerTitle = tester;
      this.error = null;

      try {
        let result = await this.$http.post(`flow/test/${tester}`, this.flow);
        this.$set(this, "result", result);
      } catch (error) {
        this.error = error;
      }
    }
  },
  computed: {
    tester: function() {
      this.$set(this, "result", []);
      return this.$route.params.tester;
    },
    headers: function() {
      if (this.result[0]) return Object.keys(this.result[0]);
      return [];
    }
  }
};
</script>
<style scoped>
.notification {
  margin: 10px;
}

.scrollx   {
 width:inherit;
 max-width:1200px;
 height:100%;
 white-space: nowrap;
 overflow-x: auto;
}
.table.result {background:#e1e1e1;border:1px solid black}
</style>