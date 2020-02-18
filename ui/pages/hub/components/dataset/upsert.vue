<template>
  <div>
    <h2 class="title" v-show="!$route.query.id">Set new database</h2>
    <h2 class="title" v-show="$route.query.id">Update database :{{$route.query.id}}</h2>

    <div class="columns">
      <div class="column is-2">
        <div class="field">
          <label class="label">DB Alias</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="DB alias"
              v-model="formData._id"
              pattern="/\w+/"
              :disabled="$route.query.id"
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
            <input class="input" type="text" placeholder="Port"   v-model="formData.db.connection.port"/>
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
        <button class="button is-primary" v-show="!$route.query.id" @click="update">Create</button>
        <button class="button is-link" v-show="$route.query.id" @click="create">Update</button>
         <button class="button is-dark" v-show="formData.db.connection.database && formData.db.client" @click="test">Test connection</button>
         <button class="button is-success" v-show="testSuccess" @click="test">Connect success</button>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "upsert",
  data() {
    return {
      testSuccess:false,
      dbClients: [
        { val: "mysql", desc: "Mysql" },
        { val: "oracle", desc: "Oracle" },
        { val: "sqlite", desc: "Sqlite" }
      ],
      formData: {
        _id: null,
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
    if (this.$route.query.id) {
      this.formData._id = this.$route.query.id;
      this.$set(this,'formData', await this.$http.get("databases/"+this.$route.query.id));
    }
  },
  methods: {
    async test() {
      await this.$http.post("databases/test",this.formData);
      this.testSuccess = true ;
      setTimeout(()=>this.testSuccess=false,3000)
    },
    async update() {
      await this.$saveModel("databases", this.formData);
    },
    async create() {
      await this.$saveModel("databases", this.formData);
    }
  },
  computed: {}
};
</script>
