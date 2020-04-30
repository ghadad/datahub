<template>
  <section v-if="value">
    <div class="columns">
      <div class="column is-2 tag-head">
        <strong class="tag title is-7 is-dark">Drop rules</strong>
      </div>
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
    <div>{{value.drop}}</div>
    <hr />
  </section>
</template>

<script>
export default {
  props: ["value", "functions"],
  data() {
    return {
      activeFunc: null
    };
  },

  mounted: function() {
    this.value.drop = this.value.drop || [];
  },
  methods: {
    addrule: function() {
      this.value.drop.push([this.activeFunc]);
    }
  },
  computed: {}
};
</script>