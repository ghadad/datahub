<template>
    <section v-if="value">
        <strong>Validations rules</strong>
           <div class="columns">
      <div class="column is-2">
        <div class="field">
          <div class="select">
            <select v-model="activeFunc">
              <option v-for="(vk,vf) in functions.validations" :key="vf" :value="vf">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeFunc}}</div>
      <div class="column is-2">
        {{activeFunc}}
        <button @click="addrule" class="buttun">Add to Validations</button>
      </div>
    </div>
    <div>{{value.validate}}</div>

    </section>
</template>

<script>
    export default {
        props: ["value", "functions"],
        data() {
            return {
                  activeFunc:null
            };
        },

        mounted: function () {
         this.value.validate = this.value.validate || [];
        },
        methods:{
          addrule:function(){
          this.value.validate.push([this.activeFunc])
         }
        },
        computed: {
         
        }
    };
</script>