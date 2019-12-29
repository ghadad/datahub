<template>
  <div>
    <h2 class="title" v-show="!dbAlias">Set new project</h2>
    <h2 class="title" v-show="dbAlias">Update project</h2>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">DB Alias</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="DB alias"
              v-model="formData.dbAlias"
              pattern="/\w+/"
              :disabled="dbAlias"
            />
          </div>
          <p class="help">unique name . use only alphanumeric letters</p>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Client</label>
          <div class="select">
            <select v-model="formData.db.client">
              <option
                v-for="client in dbClients"
                :key="client.val"
                :value="client.val"
              >{{client.desc}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Database name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Database name"
              v-model="formData.db.connection.database"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">Hostname</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Hostname"
              v-model="formData.db.connection.host"
            />
          </div>
        </div>
      </div>
      <div class="column is-1">
        <div class="field">
          <label class="label">Port</label>
          <div class="control">
            <input class="input" type="text" placeholder="Port" />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Username"
              v-model="formData.db.connection.user"
            />
          </div>
        </div>
      </div>
      <div class="column is-2">
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Password"
              v-model="formData.db.connection.password"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="buttons">
        <button class="button is-primary" v-show="!dbAlias" @click="update">Create</button>
        <button class="button is-link" v-show="dbAlias" @click="create">Update</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "upsert",
  data() {
    return {
      list: {},
      dbClients: [
        { val: "mysql", desc: "Mysql" },
        { val: "oracle", desc: "Oracle" },
        { val: "sqlite", desc: "Sqlite" }
      ],
      dbAlias: null,
      formData: {
        dbAlias: null,
        db: {
          client: null,
          connection: {
            host: null,
            port: null,
            user: null,
            password: null
          }
        }
      }
    };
  },
  async mounted() {
    this.list = await this.$parent.fetch();
    if (this.$route.query.dbAlias) {
      this.formData.dbAlias = this.dbAlias = this.$route.query.dbAlias;
      this.$set(this.formData, "db", this.list[this.dbAlias]);
    }
  },
  methods: {
    async update() {
      await this.$http.put("projects", this.formData);
    },
    async create() {
      await this.$http.post("projects", this.formData);
    }
  },
  computed: {}
};
</script>
