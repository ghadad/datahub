<template>
  <section>
    <div class="tag-head">
      <strong class="tag is-dark">
        Value origin
        <span></span>
      </strong>

      <span class="clickable" @click="toggle">
        <b-icon
          class="is-pulled-right clickable"
          :icon="isOpen?'chevron-right':'chevron-down'"
          size="is-medium"
          type="is-info"
        ></b-icon>
      </span>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-12">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-model="value.originType" native-value="collector">Collector property</b-radio>
                <b-radio v-model="value.originType" native-value="value">Simple value</b-radio>
                <b-radio v-model="value.originType" native-value="query">select Query</b-radio>
                <b-radio v-model="value.originType" native-value="dataset">Dataset</b-radio>
                <b-radio v-model="value.originType" native-value="handler">Evaluate</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-show="isOpen">
      <div class="column is-1">
        <strong class="label">{{originLabel[value.originType]}}</strong>
      </div>
      <div class="column is-9" v-if="value.originType=='query'">
        <textarea rows="5" class="textarea" v-model="value.origin"></textarea>
      </div>
      <div class="column is-9" v-if="value.originType!='query'">
         <input type="text" class="input text" v-model="value.origin"></input>
      </div>
    </div>
    <!--pre>{{value}}</pre-->
    <!--div class="panel-block" v-show="targeting=='property'">
      {{entity.properties}}
     
    </div-->
  </section>
</template>

<script>
export default {
  name: "origin",
  props: ["value", "entity"],
  data() {
    return {
      isOpen: false,
      originLabel: {
        value: "Simple value",
        query: "select one value query",
        dataset: "dataset",
        handler: "handler"
      },

      originType: null
    };
  },
  watch:{
    'value.originType':function() {
       this.isOpen =  this.value.originType =='query' ? false : true;
    }
  },
  mounted: function() {
     this.isOpen =  this.value.originType =='query' ? false : true;
  },
  methods: {
    toggle: function() {
      this.isOpen = this.isOpen ? false : true;
    },
    getOriginLabel: function() {}
  },
  computed: {},
};
</script>