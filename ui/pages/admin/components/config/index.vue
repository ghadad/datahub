<template>
  <div id="config-section">
    <div class="columns">
      <div class="column is-7">
        <table class="table is-fullwidth">
          <thead>
            <th colspan="2">General</th>
          </thead>
          <tr>
            <th>Application name</th>
            <td>
              <input class="input" v-model="configModel.appName" />
            </td>
          </tr>
          <tr>
            <th>SMTP server</th>
            <td>
              <input class="input" v-model="configModel.smtp" />
            </td>
          </tr>
          <tr>
            <th>Sender title</th>
            <td>
              <input class="input" v-model="configModel.senderTitle" />
            </td>
          </tr>
          <tr>
            <th>Sender mail</th>
            <td>
              <input class="input" v-model="configModel.senderEmail" />
            </td>
          </tr>
          <thead>
            <th colspan="2">Contacts</th>
          </thead>
          <tr>
            <th>Contact name 1</th>
            <td>
              <input class="input" />
            </td>
          </tr>
          <tr>
            <th>Contact 1 email</th>
            <td>
              <input class="input" />
            </td>
          </tr>
          <thead>
            <th colspan="2">Notifications</th>
          </thead>
          <tr>
            <th>Success message template</th>
            <td>
              <input class="input" v-model="configModel.successTemplate" />
            </td>
          </tr>
          <tr>
            <th>Failure message template</th>
            <td>
              <input class="input" v-model="configModel.failureTemplate" />
            </td>
          </tr>
          <tr>
            <th>Exceptions message template</th>
            <td>
              <input class="input" v-model="configModel.errorsTemplate" />
            </td>
          </tr>
          <tr>
            <th>Enable sms notification</th>
            <td>
              <b-checkbox></b-checkbox>
            </td>
          </tr>
          <thead>
            <th colspan="2">Interfaces</th>
          </thead>
          <tr>
            <th>Output path</th>
            <td>
              <input class="input" v-model="configModel.interfacesPath" />
            </td>
          </tr>
          <tr>
            <th>Errors path</th>
            <td>
              <input class="input" v-model="configModel.interfacesErrorsPath" />
            </td>
          </tr>
          <tr>
            <th>Log path</th>
            <td>
              <input class="input" v-model="configModel.interfacesLogPath" />
            </td>
          </tr>
        </table>
        <div class="buttons">
          <button class="button is-primary" v-show="!$route.query.id" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "config",
  data() {
    return {
      configModel: {}
    };
  },
  methods: {
    async save() {
      await await this.$http.put(`/docs/config`, this.configModel);
    }
  },
  async mounted() {
    this.$set(
      this,
      "configModel",
      await this.$http.get(`/docs/config/${this.$root.sysConfig.env}`)
    );
  }
};
</script> 

<style>
thead th {
  background: #ccc;
}
</style>