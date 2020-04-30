<template>
  <section v-if="value">
    <div class="columns">
      <div class="column is-2 tag-head">
        <strong class="tag title is-7 is-dark">Transforms rules</strong>
      </div>
      <div class="column is-2" v-show="isOpen">
        <div class="field">
          <div class="select">
            <select v-model="activeFunc">
              <option v-for="(vk,vf) in functions.transforms" :key="vf" :value="vf">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-8">{{activeFunc}}</div>
      <div class="column is-2" v-show="isOpen">
        {{activeFunc}}
        <button @click="addrule" class="buttun">Add to Transforms</button>
      </div>
    </div>
    <div>{{value.transform}}</div>
  </section>
</template>

<script>
export default {
  props: ["value", "functions"],
  data() {
    return {
      isOpen: false,
      activeFunc: null
    };
  },

  mounted: function() {
    this.value.transform = this.value.transform || [];
  },
  methods: {
    addrule: function() {
      this.value.transform.push([this.activeFunc]);
    }
  },
  computed: {}
};
</script>