<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <router-link class="button is-link" :to="{name:'interfaceUpsert'}">New Interface</router-link>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>interface name</th>
          <th>Description</th>
          <th>Is active</th>
          <th>version</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="Object.values(list).length==0">
        <th colspan="5" class="has-border-dark">
          No interfaces found !
          <router-link
            :to="{name:'interfaceUpsert'}"
            class="button is-info is-small"
            @click="update"
          >Create new interface</router-link>
        </th>
      </tbody>
      <tbody>
        <tr v-for="(p,index) in list" :key="p._id">
          <td>{{index+1}}</td>
          <td>{{p._id}}</td>
          <td>{{p.description}}</td>
          <td>
            <b-checkbox v-model="p.active" :disabled="true"></b-checkbox>
          </td>
          <td>{{p.version}}</td>
          <td>
            <div class="buttons">
              <button class="button is-info" @click="update(p)">Edit</button>
              <button
                class="button is-danger"
                v-show="!interfacesToDelete[p._id]"
                @click="deleteinterface(p)"
              >Delete</button>
              <button
                class="button is-danger"
                v-show="interfacesToDelete[p._id]"
                @click="deleteinterface(p)"
              >Are you sure ?</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "interfaces-list",
  data() {
    return {
      list: {},
      deleteStep: 1,
      interfacesToDelete: {}
    };
  },
  methods: {
    async deleteinterface(p) {
      if (this.interfacesToDelete[p._id]) {
        await this.$http.delete(`docs/interfaces/${p._id}/${p._rev}`);
        this.$set(
          this,
          "list",
          this.$_.filter(this.list, i => i._id != p._id)
        );
      }

      this.$set(this.interfacesToDelete, p._id, true);
      setTimeout(() => this.$set(this.interfacesToDelete, p._id, false), 3000);
    },

    update(p) {
      this.$router.push({
        path: "/interface/upsert",
        query: { id: p._id }
      });
    }
  },
  async mounted() {
    this.list = await this.$http.get("/docs/interfaces");
  }
};
</script>