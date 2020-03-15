<template>
  <div>
    <div class="columns">
      <div class="column is-5">
        <table class="fast-mapping table is-bordered is-fullwidth">
          <thead>
            <th colspan="3" class>Collector properties</th>
          </thead>
          <tbody>
            <tr v-for="(p,index) in fastRules" :key="index" class="clickable">
              <td class="dropzone">{{p.originCollector}}</td>
              <td class="dropzone">
                <b-icon icon="arrow-right"></b-icon>
              </td>
              <td style="border:3px dotted #CCC;padding:0">
                <drag :transfer-data="p">
                  <drop class="dropzone" @drop="handleDrop(p,...arguments)">
                    <div v-show="!p.goTo" class="white-dropzone">Drop here</div>
                    <div v-show="p.goTo" class>{{p.goTo}}</div>
                  </drop>
                </drag>
              </td>
            </tr>
          </tbody>
        </table>
        <b-notification v-if="!fastRules.length" type="is-danger" :closable="false">
          <p>No proerties found in collector</p>
          <router-link :to="{name:'collector',query:{activeStep:1}}">Add properties here</router-link>
        </b-notification>
      </div>

      <div v-if="!entityProperties.length" class="column is-4">
        <b-notification type="is-danger" :closable="false">
          <p>No proerties found for {{entity.name}} entity</p>
          <router-link :to="{name:'entity',params:{entity:entity.name}}">Add properties here</router-link>
        </b-notification>
      </div>

      <div v-if="entityProperties.length" class="column is-4">
        <drop class @drop="handleReturnDrop">
          <table class="fast-mapping table is-bordered is-fullwidth">
            <thead>
              <th>Target {{entity.name}} properties</th>
            </thead>
            <tbody>
              <tr
                v-show="visibilityList[p.name] != 'N'"
                v-for="(p,index) in entityProperties"
                :key="index"
                class="clickable dropzone"
              >
                <td>
                  <drag :transfer-data="p">{{p.name}}</drag>
                </td>
              </tr>
            </tbody>
          </table>
        </drop>
      </div>
      <div v-if="entityProperties.length" class="column is-2">
        <button class="button is-info" @click="generate">Generate rules</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Drag, Drop } from "vue-drag-drop";

export default {
  name: "fast-mapping",
  props: ["rules", "entity", "collector"],
  components: {
    Drag,
    Drop
  },
  data: function() {
    return {
      visibilityList: {},
      fastMappingIndex: [],
      fastAssignment: false,
      fastRules: [],
      entityProperties: []
    };
  },
  mounted() {
    this.fastRules = this.$_.cloneDeep(
      (this.collector.properties || []).map(function(e) {
        return { name: "map " + e, originCollector: e, originType: "property" };
      })
    );
    //this.fastMappingIndex = this.$_.range(this.collectorProperties.length)
    this.entityProperties = this.$_.cloneDeep(this.entity.properties || []);
  },
  methods: {
    generate() {
      this.$set(
        this,
        "cRules",
        this.fastRules.filter(e => e.goTo)
      );
    },
    handleReturnDrop(data) {
      let self = this;
      self.$set(self.visibilityList, data.goTo, "Y");
      delete data.goTo;
    },
    handleDrop(p, data) {
      let self = this;
      if (data.name != p.goTo && p.goTo)
        self.$set(self.visibilityList, p.goTo, "Y");
      self.$set(self.visibilityList, data.name, "N");
      self.$set(p, "goTo", data.name);
      self.$set(p, "targetType", "property");
      self.$set(p, "originType", "collector");
    }
  },
  computed: {
    cRules: {
      get: function() {
        return this.$props.rules;
      },
      set(newValue) {
        this.$emit("update:rules", newValue);
      }
    }
  }
};
</script>
<style scoped>
.dropzone {
  padding: 15px;
  font-weight: bolder;
  line-height: 30px;
}
.dropzone div {
  font-weight: bolder;
  line-height: 30px;
}
.white-dropzone {
  color: white;
}
</style>