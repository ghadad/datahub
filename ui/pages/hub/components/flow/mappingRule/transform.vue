<template>
  <section v-if="value">
      <div class="columns">
      <div class="tag-head">
        <strong class="tag title is-7 is-dark">Transforms rules</strong>
      </div>
      <div class="column is-12">
exists rules
    <div>{{value.transform}}</div>

      </div>

    </div>
    <div class="columns">
      <div class="sub-tag-head">
        <strong class="tag title is-7 is-default">Add new</strong>
      </div>
      <div class="column is-2">
        <div class="field">
          <div class="select">
            <select v-model="activeFunc">
              <option v-for="(vk,vf) in functions.transforms" :key="vf" :value="vf">{{vf}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-7">{{activeFunc}}</div>
      <div class="column is-1">
        <button @click="addrule" class="buttun">Add</button>
      </div>
    </div>
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
