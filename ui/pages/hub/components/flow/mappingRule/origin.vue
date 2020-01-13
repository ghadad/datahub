<template>
  <section>
    <strong>Value origin</strong>
    <div class="columns">
      <div class="column is-8">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-model="originType" name="name" native-value="value">Simple value</b-radio>
                <b-radio v-model="originType" name="name" native-value="query">select Query</b-radio>
                <b-radio v-model="originType" name="name" native-value="dataset">Dataset</b-radio>
                <b-radio v-model="originType" name="name" native-value="handler">Evaluate</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-1">
        <strong class="label">{{originLabel[originType]}}</strong>
      </div>
      <div class="column is-9">
        <textarea rows="5" class="textarea" v-model="value.origin"></textarea>
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
  props: ["value", "entity"],
  data() {
    return {
      originLabel: {
        value: "Simple value",
        query: "select one value query",
        dataset: "dataset",
        handler: "handler"
      },
      goToValue: "aaa",
      originType: null
    };
  },
  mounted: function() {
    this.goToValue = this.value.goTo || "";
  },
  methods: {
    getOriginLabel: function() {}
  },
  computed: {
    filteredDataArray() {
      let self = this;
      return this.entity.properties
        .filter(option => {
          return (
            option.name
              .toString()
              .toLowerCase()
              .indexOf(this.goToValue.toLowerCase()) >= 0
          );
        })
        .map(e => e.name);
    }
  }
};
</script>