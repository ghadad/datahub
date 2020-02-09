<template>
  <div class="columns">
    <div class="column is-12">

    <button class="button is-link" @click="runTest(tester)">Test {{tester}}</button>
    &nbsp;<button class="button is-link" @click="runTest(tester+'_handler')">Test {{tester}} post handler</button>
     <b-notification v-show="error" :closable="false" type="is-danger"  class="error">{{error}}</b-notification>
     <h3 class="title is-4">{{testerTitle}}  result </h3>
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
        testerTitle:null,
        error:null,
        flow: {},
        result: []
      };
    },

    async mounted() {
      this.tester = this.$route.params.tester;
      this.flow = this.$parent.$data.flowData;

    },
    methods: {
      async runTest(tester) {
        this.testerTitle =  tester;
        this.error=null;
        try { 
        let result = await this.$http.post(`flow/test/${tester}`, this.flow)
        this.$set(this, 'result',result );  
        } catch(error) { 
          
          this.error = error
        }
        
      },
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
<style scoped>
.notification { margin:10px }
</style>