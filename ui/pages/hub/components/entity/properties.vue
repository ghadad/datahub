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
            placeholder="property Name"
            v-model="property.name"
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
            placeholder="property type"
            v-model="property.type"
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
            placeholder="Restrictions"
            v-model="property.restriction"
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
               <th scope="col">Actions</th>
            </tr>
          </thead>
          <draggable v-model="dragableList" tag="tbody">
            <tr v-for="(item,index) in dragableList" :key="index" class="clickable">

   
              <td>{{ index+1 }}</td>
              <td v-if="activeEditIndex!=index">{{ item.name }}</td>
              <td v-if="activeEditIndex==index"><input class="input" type="text" v-model="item.name"></td>

              <td v-if="activeEditIndex!=index">{{ item.type }}</td>
              <td v-if="activeEditIndex==index"><input class="input" type="text" v-model="item.type"></td>
               <td v-if="activeEditIndex!=index">{{ item.pk }}</td>
              <td v-if="activeEditIndex==index"><input class="input" type="text" v-model="item.pk"></td>
               <td v-if="activeEditIndex!=index">{{ item.restrictions }}</td>
              <td v-if="activeEditIndex==index"><input class="input" type="text" v-model="item.restrictions"></td>
                                  <td>
              <span class="icon  clickable" @click="activeEditIndex=index">
              <b-icon icon="edit" type="is-link" size="is-small"></b-icon> 
              </span>
              <span class="icon clickable" @click="del(index)">
              <b-icon icon="trash" type="is-danger" size="is-small"></b-icon>
              </span>
              </td>
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
      activeEditIndex:null,
      enabled: true,
      dragging: false,
      property: {
        name: null,
        type: null,
        restriction: null
      }
    };
  },
  mounted() {
    this.dragableList = this.dragableList || [];
    //  alert(1);
  },

  methods: {
    edit(index) {

    },
    del(index) { 
      this.dragableList.splice(index,1)
    },
    add() {
      if (!(this.property.name && this.property.type)) return;
      this.dragableList.push(this.property);
      this.property = {
        name: null,
        type: null,
        restriction: null
      };
    }
  },
  computed: {
    dragableList: {
      get() {
        return this.list;
      },
      set(newValue) {
        this.$emit("update:list", newValue);
      }
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