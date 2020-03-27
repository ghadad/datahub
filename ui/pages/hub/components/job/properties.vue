<template>
  <div>
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
            @change="property.name=$normalizeName(property.name)"
          />
        </div> 
      </div>
      <div class="column is-3">
         <label class="label">Type</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="property.type">
              <option
                v-for="(datatype,index) in datatypes"
                :key="index"
                :value="datatype.type"
              >{{datatype.type}}</option>
            </select>
          </div>
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
        <div class="table" style="max-height:100%;height:100%px;overflow-y:true;x-overfloww:false">
          <strong class="is-5">
            Properties :
            <input v-model="term" />
          </strong>
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
                <td v-if="activeEditIndex==index">
                  <input class="input" type="text" v-model="item.name" />
                </td>

                <td v-if="activeEditIndex!=index">{{ item.type }}</td>
                <td v-if="activeEditIndex==index">
                  <input class="input" type="text" v-model="item.type" />
                </td>
                <td v-if="activeEditIndex!=index">{{ item.pk }}</td>
                <td v-if="activeEditIndex==index">
                  <input class="input" type="text" v-model="item.pk" />
                </td>
                <td v-if="activeEditIndex!=index">{{ item.restrictions }}</td>
                <td v-if="activeEditIndex==index">
                  <input class="input" type="text" v-model="item.restrictions" />
                </td>
                <td>
                  <span class="icon clickable" @click="term='';activeEditIndex=index">
                    <b-icon icon="edit" type="is-info" size="is-small"></b-icon>
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
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "properties",
  props: ["list", "datatypes"],
  components: { draggable },
  data() {
    return {
      term: "",
      activeEditIndex: null,
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
    edit() {},
    del(index) {
      this.dragableList.splice(index, 1);
    },
    add() {
      if (!(this.property.name && this.property.type)) return;
      if (this.dragableList.filter(e => e.name == this.property.name).length)
        throw Error(`${this.property.name}  Already exists`);

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
        let re = new RegExp(this.term, "i");
        if (this.term) return this.list.filter(e => e.name.match(re));
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
tr.clickable {
  border: 1px solid #ccc;
}
tr.clickable:hover {
  background: #eee !important;
  font-weight: bolder;
}

tr td {
  padding-top: 1px;
  padding-bottom: 1px;
}
div.table {
  height: 700px;
  max-height: 700px;
  overflow-x: hidden;
}
div.table .table {
  width: 95%;
}
</style>