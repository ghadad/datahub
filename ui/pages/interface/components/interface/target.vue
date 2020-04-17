<template>
  <section v-if="value" id="target-section">
    <div class="tag-head">
      <strong class="tag title is-7 is-dark">Targeting</strong>
    </div>
    <div class="columns">
      <div class="column">
        <div class="block">
          <div class="field">
            <section>
              <div class="block">
                <b-radio v-if="1" v-model="value.targetType" native-value="property">property</b-radio>
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

    <div class="columns" v-if="value.targetType=='variable'">
      <div class="column is-3">
        <strong class="label">case sensitive variabe name</strong>
      </div>
      <div class="column is-3">
        <input type="text" class="control" v-model="value.goToVar" />
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      goToValue: this.value.goTo || ""
    };
  },
  mounted: function() {},
  computed: {}
};
</script>
<style scoped>
label.b-radio.radio {
  margin-right: 30px;
}
#target-section .column {
  padding-top: 4px;
  padding-bottom: 10px;
}
</style>