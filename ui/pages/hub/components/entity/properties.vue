<template>
  <div>
    <h2>Properties :</h2>
    <div class="columns">
      <div class="field column is-4">
        <label class="label">name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="entityName"
            v-model="entity.name"
            pattern="/\w+/"
          />
        </div>
      </div>
      <div class="column is-3">
        <label class="label">Type</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="entity type"
            v-model="entity.type"
            pattern="/\w+/"
          />
        </div>
      </div>
      <div class="column is-3">
        <label class="label">Restrictions</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="entityName"
            v-model="entity.restriction"
            pattern="/\w+/"
          />
        </div>
      </div>
      <div class="column is-2">
        <label class="label">name</label>
        <button class="button is-light" @click="add()">Add property</button>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <table class="table is-fullwidth is-dark">
          <thead class="thead-dark">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">PK</th>
              <th scope="col">Restrictions</th>
            </tr>
          </thead>
          <draggable v-model="properties" tag="tbody">
            <tr v-for="(item,index) in properties" :key="item.name">
              <td>{{ index+1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.pk }}</td>
              <td>{{ item.restrictions }}</td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "properties",
  props: ["list"],
  components: { draggable },
  data() {
    return {
      properties: this.$_.cloneDeep(this.$props.list),
      enabled: true,
      dragging: false,
      entity: {
        name: null,
        type: null,
        restriction: null
      }
    };
  },
  mounted() {
    //  alert(1);
  },
  methods: {
    add() {
      if (!(this.entity.name && this.entity.type)) return;
      this.properties.push(this.entity);
      this.entity = {
        name: null,
        type: null,
        restriction: null
      };
    }
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>