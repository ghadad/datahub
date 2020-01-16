<template>
  <section>
    <div class="columns">
      <div class="column is-2 tag-head">
        <strong class="tag title is-7 is-dark">Value origin</strong>
      </div>
      <div class="column is-8">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
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
    <div class="columns">
      <div class="column is-1">
        <strong class="label">{{originLabel[value.originType]}}</strong>
      </div>
      <div class="column is-9">
        <textarea rows="5" class="textarea" v-model="value.origin"></textarea>
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
      originLabel: {
        value: "Simple value",
        query: "select one value query",
        dataset: "dataset",
        handler: "handler"
      },

      originType: null
    };
  },
  mounted: function() {},
  methods: {
    getOriginLabel: function() {}
  },
  computed: {}
};
</script>