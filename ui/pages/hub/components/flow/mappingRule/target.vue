<template>
  <section v-if="value">
    <div class="tag-head">
      <strong class="tag title is-7 is-dark">Targeting</strong>
      <span v-show="!entity.name">
        Please note ! there is no entity defined in collector setting !
        <router-link :to="{name:'collector',query:{activeStep:1}}">add it here</router-link>
      </span>
    </div>
    <div class="columns">
      <div class="column">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio
                  v-if="entity.name"
                  v-model="value.targetType"
                  native-value="property"
                ><Span class="tag  is-info">{{entity.name}} </span> property</b-radio>
                <b-radio v-model="value.targetType" native-value="variable">Variable</b-radio>
                <b-radio v-model="value.targetType" :native-value="''">Irrelevant</b-radio>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div class="column is-4" v-show="value.targetType=='property'">
        <div class="field">
          <b-checkbox v-model="value.hash">Revision factor</b-checkbox>
        </div>
      </div>
    </div>

    <div class="columns" v-if="value.targetType=='property' && entity.name">
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
    <div class="columns" v-if="value.targetType=='variable'">
      <div class="column is-3">
        <strong class="label">case sensitive variabe name</strong>
      </div>
      <div class="column is-3">
        <input type="text" class="control" v-model="value.$var" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["value", "entity"],
  data() {
    return {
      goToValue: this.value.goTo || ""
    };
  },
  mounted: function() {},
  computed: {
    
    filteredDataArray() {
      let self = this;

      return this.entity.properties
        .filter(option => {
          return (
            option.name
              .toString()
              .toLowerCase()
              .indexOf((self.goToValue || "").toLowerCase()) >= 0
          );
        })
        .map(e => e.name);
    }
  }
};
</script>
<style scope>
label.b-radio.radio {margin-right :30px}
</style>