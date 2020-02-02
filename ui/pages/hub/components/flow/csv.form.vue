<template>
  <div>
    <div class="title is-5">CSV Source properties</div>
    <div class="columns">
      <div class="column is-1">
        <div class="field">
          <label class="label">seperator</label>
          <div class="control">
            <input
              size="1"
              class="input"
              type="text"
              placeholder="Seperator"
              v-model="collector.seperator"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
      <div class="column is-8">
        <div class="field">
          <label class="label">Source Path</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="collector.sourcePath"
              pattern="/\w+/"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="title is-5">Map Fields to properties</div>
    <div class="columns">
      <div class="column is-4">
        <div class="field is-horizontal">
          <div class="field-label has-text-left">
            <label class="label">Field name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input" type="text" placeholder="Field name" v-model="csvField" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-1">
        <button class="button is-info" @click="add">Add</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div>
          <draggable v-model="dragableList">
            <div v-for="(t,index) in dragableList" :key="index" class="property-tag tag is-default">
              {{index}} : {{t}}
              <span class="clickable" @click="del(index)">
                <b-icon class="is-pulled-right clickable" icon="trash" size="is-small" type></b-icon>
              </span>
            </div>
          </draggable>
        </div>

        <hr />
      </div>
    </div>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Define the entity key</label>
          <div class="select">
            <select v-model="collector.keyType">
              <option v-for="(desc,kt) in keyTypes" :key="kt" :value="kt">{{desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-1" v-if="collector.keyType=='index'">
        <div class="field">
          <label class="label">Field Position</label>
          <div class="control">
            <input class="input" v-model="collector.pkSource" type="integer" />
          </div>
        </div>
      </div>
      <div class="column is-2" v-if="collector.keyType=='property'">
        <div class="field">
          <label class="label">Field /property</label>
          <div class="control">
            <input class="input" v-model="collector.pkSource" type="text" />
          </div>
        </div>
      </div>
      <div class="column is-10" v-if="collector.keyType=='handler'">
        <div class="field">
          <label class="label">Define the key using function</label>
          <div class="control">
            <textarea rows="15" class="textarea" v-model="collector.pkSource"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "csv-collector",
  props: ["collector", "properties"],
  components: { draggable },

  data: function() {
    return {
      handlerTemplate: `function(data){
        //data is the current gatthered document
        // for example : 
        // return data[3] +"/"+ data[2];
      }`,
      csvField: null,
      keyType: null,
      keyTypes: {
        index: "Field position",
        handler: "function/handler",
        property: "Header field"
      }
    };
  },
  watch: {
    "collector.keyType": function(newVal, oldVal) {
      if (newVal == "pkHandler")
        this.collector.pkHandler = this.handlerTemplate;
    }
  },
  async mounted() {
    this.dragableList = this.dragableList;
  },
  methods: {
    add(name) {
      if (!name) return;
      this.dragableList.push(this.csvField);
      this.csvField = null;
    },
    del(index) {
      this.dragableList.splice(index, 1);
    }
  },
  computed: {
    dragableList: {
      get() {
        return this.properties || [];
      },
      set(newValue) {
        this.$emit("update:properties", newValue);
      }
    }
  }
};
</script>
<style>
.property-tag.tag {
  margin-left: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
}

.property-tag.tag .icon {
  padding-left: 25px;
  padding-right: 15px;
  font-size: 14px;
}
</style>