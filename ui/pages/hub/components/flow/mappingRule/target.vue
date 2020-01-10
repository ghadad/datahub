<template>
  <section>
    <strong>Targeting</strong>
    <div class="columns">
      <div class="column is-6">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-model="targeting" name="name" native-value="property">
                  Targeting
                  {{entity.name}} property
                </b-radio>
                <b-radio v-model="targeting" name="name" native-value="variable">Variable</b-radio>
                <b-radio v-model="targeting" name="name" native-value="''">Not targeting</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div class="column is-4" v-show="targeting=='property'">
        <div class="field">
          <b-checkbox v-model="value.hash">Revision factor</b-checkbox>
        </div>
      </div>
    </div>
    <div class="columns" v-show="targeting=='property'">
      <div class="column is-3">
        <strong class="label">Pick propery from {{entity.name}} entity</strong>
      </div>
      <div class="column is-3">
        <b-autocomplete
          v-model="goToValue"
          :data="filteredDataArray"
          placeholder="type for lookup "
          icon="magnify"
          @select="option => value.goTo = option"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
      </div>
    </div>
    <div class="columns" v-show="targeting=='variable'">
      <div class="column is-3">
        <strong class="label">case sensitive variabe name</strong>
      </div>
      <div class="column is-3">
        <input type="text" class="control" v-model="value.$var" />
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
      goToValue: "aaa",
      targeting: null
    };
  },
  mounted: function() {
    this.goToValue = this.value.goTo || "";
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