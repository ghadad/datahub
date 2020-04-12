<template>
  <div v-if="jobData">
    <div class="columns">
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
          <b-radio v-model="computedValue.method" native-value="crontab">Crontab</b-radio>
          <b-radio v-if="0" v-model="computedValue.method" native-value="interval">Interval</b-radio>
          <b-radio v-model="computedValue.method" :native-value="'request'">By request</b-radio>
          <b-checkbox
            v-show="computedValue.method=='crontab'"
            class="is-pulled-right"
            v-model="computedValue.startImmediately"
          >start immediately</b-checkbox>
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
        <div class="block crontab" v-if="computedValue.method=='crontab'">
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
                v-model="computedValue.scheduling.seconds"
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
                v-model="computedValue.scheduling.minutes"
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
                v-model="computedValue.scheduling.hours"
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
                v-model="computedValue.scheduling.dayOfMonth"
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
                v-model="computedValue.scheduling.months"
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
                v-model="computedValue.scheduling.dayOfWeek"
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

    <div>jobData:{{computedValue}}</div>
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
      this.computedValue.scheduling[el] = e.target.value
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

    async delJob() {
      this.project.jobs.splice(this.$route.params.job, 1);
      await this.$saveProject(this.project, { name: "jobs" });
    }
  },
  watch: {
    delStep(newVal) {
      if (newVal == 1) setTimeout(() => (this.delStep = 0), 2500);
    }
  },
  async mounted() {
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
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
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