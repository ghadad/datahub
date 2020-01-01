<template>
  <div>
    <h2>Properties :</h2>
    <button class="button is-light" @click="add()">Add property</button>
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
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "properties",
  props: ["list"],
  components: { draggable },
  data() {
    return {
      properties: this.$props.list,
      enabled: true,
      dragging: false
    };
  },
  mounted() {
    this.properties = this.$props.list;
    //  alert(1);
  },
  methods: {
    add() {
      this.properties.push({ name: "dsds", type: "string" });
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