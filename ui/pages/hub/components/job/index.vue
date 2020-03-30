<template>
  <div v-if="jobData">
    <div class="columns">
      <div class="column is-5">
        <div class="field">
          <label class="label">Short description</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Entity name"
              v-model="jobData.description"
            />
          </div>
        </div>
        <div class="field">
          <div class="label">
            <label class="label">Available flows</label>
          </div>
          <div class="select is-fullwidth">
            <select v-model="selectedFlow">
              <option
                v-for="(flow,index) in availableFlows"
                :key="index"
                :value="flow.config.name"
                v-show="!checkDisable(flow.config.name)"
              >{{flow.config.name}}:{{flow.config.shortDescription}}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <button class="button is-primary" @click="add">Add flow to job</button>
        </div>
        <div class="block">
          <table class="table is-fullwidth is-dark">
            <thead class="thead-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Flow</th>
              </tr>
            </thead>
            <draggable v-model="jobData.flows" tag="tbody">
              <tr v-for="(flow,index) in jobData.flows" :key="index" class="clickable">
                <td>{{ index+1 }}</td>
                <td>{{ flow }}</td>
              </tr>
            </draggable>
          </table>
        </div>
        <div class="field">
          <button class="button is-info" v-show="$route.params.job" @click="update">Apply</button>
          <button class="button is-info" v-show="!$route.params.job" @click="create">Create</button>
          <button
            class="button is-danger"
            v-show="$route.params.job && delStep==0"
            @click="delStep=1"
          >Delete job</button>
          <button class="button is-danger" v-show="delStep==1" @click="delJob">Are you sure ?</button>
        </div>
      </div>
      <div class="column is-5">
        <div class="title is-6">Scheduling rules</div>
        <div class="block">
          <button @click="cronHelp=!cronHelp" class="is-white is-small button">
            <b-icon class="is-pulled-right clickable" icon="info" size="is-white"></b-icon>
            <b-icon
              v-show="cronHelp"
              class="is-pulled-right clickable"
              icon="chevron-up"
              size="is-white"
            ></b-icon>
            <b-icon
              v-show="!cronHelp"
              class="is-pulled-right clickable"
              icon="chevron-down"
              size="is-white"
            ></b-icon>
          </button>
          <b-radio v-model="jobData.method" native-value="crontab">Crontab</b-radio>
          <b-radio v-model="jobData.method" native-value="interval">Interval</b-radio>
          <b-radio v-model="jobData.method" :native-value="'request'">By request</b-radio>
        </div>
        <div class="block" v-show="cronHelp">
          <ul class="list">
            <li class="list-item">
              use
              <span class="tag">*</span> for any value , for example : * for every minute
            </li>
            <li class="list-item">
              use
              <span class="tag">,</span> for list separator , or example : 1,5 is the first and fifth hour
            </li>
            <li class="list-item">
              use
              <span class="tag">-</span> for range of values , for example : 3-9 is the range between 3 to 9 minutes
            </li>
            <li class="list-item">
              use
              <span class="tag">*/</span> for step values , for example : */25 is the every 25th minute
            </li>
          </ul>
        </div>
        <div class="block crontab" v-if="jobData.method=='crontab'">
          <div class="field has-addons has-addons-left is-expanded">
            <p class="control">
              <a class="button is-static">Seconds (0-59)</a>
            </p>
            <div class="control is-fullwidth">
              <input
                class="input"
                type="text"
                min="0"
                max="59"
                placeholder="Seconds"
                v-model="jobData.scheduling.seconds"
                @change="normalizeCron('seconds',0,$event)"
              />
            </div>
            <p v-show="errors.seconds" class="control">
              <a class="button">error</a>
            </p>
          </div>
          <div class="field has-addons has-addons-left">
            <p class="control">
              <a class="button is-static">Minutes (0-59)</a>
            </p>
            <div class="control">
              <input
                class="input"
                min="0"
                max="59"
                type="text"
                placeholder="Minutes"
                v-model="jobData.scheduling.minutes"
                @change="normalizeCron('minutes',1,$event)"
              />
            </div>
            <p v-show="errors.minutes" class="control">
              <a class="button">error</a>
            </p>
          </div>
          <div class="field has-addons has-addons-left">
            <p class="control">
              <a class="button is-static">Hours (0-23)</a>
            </p>
            <div class="control">
              <input
                class="input"
                type="text"
                min="0"
                max="23"
                placeholder="Hours"
                v-model="jobData.scheduling.hours"
                @change="normalizeCron('hours',2,$event)"
              />
            </div>
            <p v-show="errors.hours" class="control">
              <a class="button">error</a>
            </p>
          </div>
          <div class="field has-addons has-addons-left">
            <p class="control">
              <a class="button is-static">Day of month (1-31)</a>
            </p>
            <div class="control">
              <input
                class="input"
                type="text"
                min="1"
                max="31"
                placeholder="Day of Month"
                v-model="jobData.scheduling.dayOfMonth"
                @change="normalizeCron('dayOfMonth',3,$event)"
              />
            </div>
            <p v-show="errors.dayOfMonth" class="control">
              <a class="button">error</a>
            </p>
          </div>
          <div class="field has-addons has-addons-left">
            <p class="control">
              <a class="button is-static">Months (0-11)</a>
            </p>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Months"
                v-model="jobData.scheduling.months"
                @change="normalizeCron('months',4,$event)"
              />
            </div>
            <p v-show="errors.months" class="control">
              <a class="button">Error</a>
            </p>
          </div>
          <div class="field has-addons has-addons-left">
            <p class="control">
              <a class="button is-static">Day of week (0-6)</a>
            </p>
            <div class="control">
              <input
                class="input"
                type="text"
                min="1"
                max="7"
                placeholder="Day of week"
                v-model="jobData.scheduling.dayOfWeek"
                @change="normalizeCron('dayOfWeek',5,$event)"
              />
            </div>
            <p v-show="errors.everyDayOfWeek" class="control"></p>
          </div>
        </div>
        <div class="block">
          Readable scheduling :
          <strong>{{cronToString}}</strong>
        </div>
        <div class="block">
          next run :
          <strong>{{nextRun}}</strong>
        </div>
        <div class="block">
          previuse run :
          <strong>{{prevRun}}</strong>
        </div>
      </div>
    </div>

    <div>jobData:{{jobData}}</div>
    <div>project jobs:{{project.jobs}}</div>
  </div>
</template>

<script>
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import draggable from "vuedraggable";

export default {
  name: "job",
  components: { draggable },
  data: function() {
    return {
      delStep: 0,
      cronToString: "",
      errors: {
        seconds: null,
        minutes: null,
        hours: null,
        dayOfMonth: null,
        months: null,
        dayOfWeeks: null
      },
      cronHelp: false,
      project: { flows: [] },
      jobData: {
        description: "",
        flows: [],
        scheduling: {
          seconds: null,
          minutes: null,
          hours: null,
          dayOfMonth: null,
          months: null,
          dayOfWeeks: null
        }
      },
      selectedFlow: null
    };
  },
  methods: {
    normalizeCron(el, pos, e) {
      this.errors[el] = null;
      let arr = ["*", "*", "*", "*", "*", "*"];
      this.jobData.scheduling[el] = e.target.value
        .replace(/[^,0-9*/-]/g, "")
        .replace(/[,.]+/g, ",")
        .replace(/-+/g, "-")
        .replace(/\*(\d+)/, "*/$1");
      arr[pos] = e.target.value;
      try {
        var interval = cronParser.parseExpression(arr.join(" "));
        this.nextRun = interval.next().toString();
        this.prevRun = interval.prev().toString();
        this.cronToString = cronstrue.toString(arr.join(" "));
      } catch (e) {
        this.errors[el] = "ERROR";
        this.cronToString = "ERROR";
      }
    },
    checkDisable(flow) {
      return this.jobData.flows.find(e => e == flow);
    },
    delFlow(index) {
      this.jobData.tasks.splice(index, 1);
    },
    add() {
      this.jobData.flows.push(this.selectedFlow);
      this.selectedFlow = "";
    },

    async delJob() {
      this.project.jobs.splice(this.$route.params.job, 1);
      await this.$saveProject(this.project, { name: "jobs" });
    },
    async create() {
      this.project.jobs.push(this.jobData);
      await this.$saveProject(this.project);
    },
    async update() {
      this.$set(this.project.jobs, this.$route.params.job, this.jobData);
      await this.$saveProject(this.project);
    }
  },
  watch: {
    delStep(newVal) {
      if (newVal == 1) setTimeout(() => (this.delStep = 0), 2500);
    }
  },
  async mounted() {
    this.project = await this.$http.get(
      `projects/${this.$route.params.project}`
    );
    if (this.$route.params.job >= 0) {
      this.$set(
        this,
        "jobData",
        Object.assign(
          {},
          this.jobData,
          this.project.jobs[this.$route.params.job]
        )
      );
    }
    this.$root.$emit("breadcrumbs", [
      {
        name: "jobs"
      },
      {
        name: "explore",
        title: this.$route.params.project
      },
      {
        title: this.$route.params.job
          ? "Job # " + this.$route.params.job
          : "New job",
        active: true
      }
    ]);
  },
  computed: {
    availableFlows() {
      return this.project.flows || [];
    },

    config() {
      return window.$serverConfig;
    },
    datatypes() {
      if (this.config.dataTypes && this.jobData.dbEngine)
        return [
          { type: "" },
          ...Object.values(this.config.dataTypes[this.jobData.dbEngine])
        ];
      return [];
    },
    databases() {
      return Object.keys(this.config.dataTypes);
    }
  }
};
</script>
<style>
.crontab .control input {
  width: 200px !important;
  justify-content: left;
}

.crontab .control .button {
  width: 200px !important;
  justify-content: left;
}
</style>