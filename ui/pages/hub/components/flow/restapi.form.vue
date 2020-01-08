<template>
  <div>
    <h1>CSV Source properties</h1>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">URL</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="value.sourceUrl"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Source Path</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="value.sourcePath"
              pattern="/\w+/"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "restapi-collector",
  props: ["value"],
  data: function() {
    return {};
  },
  async mounted() {}
};
</script>