<template>
    <section>
        <strong>DRop pipeline</strong>
       <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Trasformation pipeline</label>
          <div class="select">
            <select v-model="activeTransformation">
              <option v-for="(vk,vf) in functions.transforms" :key="vk" :value="vk">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeTransformation.desc}}</div>
      <div class="column is-2">
        {{activeTransformation.params}}
        <button>Add to pipeline</button>
      </div>
    </div>
       
        <!--div class="panel-block" v-show="targeting=='property'">
      {{entity.properties}}
      <pre>{{filteredDataArray}}</pre>
    </div-->
    </section>
</template>

<script>
    export default {
        props: ["value", "functions"],
        data() {
            return {
                  activeTransformation:{}
            };
        },
        mounted: function () {
         
        },
        methods: {
         
        },
        computed: {
         
        }
    };
</script>