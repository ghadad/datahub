<template>
  <div v-if="isLoaded">
    <h1 class="title is-5">notifications</h1>
    <section>
      <b-tabs v-model="activeTab" :animated="false" :multiline="true">
        <template>
          <b-tab-item label="Success messages">
            <notif-block
              type="success"
              title="Succcess notification"
              v-model="computedValue.success"
            ></notif-block>
          </b-tab-item>
          <b-tab-item label="Failure messages">
            <notif-block
              type="failure"
              title="Failure  notification"
              v-model="computedValue.failure"
            ></notif-block>
          </b-tab-item>
          <b-tab-item label="Exceptions message">
            <notif-block
              type="errors"
              title="Exceptions notification"
              v-model="computedValue.errors"
            ></notif-block>
          </b-tab-item>
          <b-tab-item label="SMS">
            <b-field horizontal label="numbers" message="Please enter a numbers">
              <b-input name="subject" expanded v-model="computedValue.subject"></b-input>
            </b-field>
            <b-field label="Message" horizontal>
              <b-input maxlength="50" type="textarea" v-model="computedValue.sms.template"></b-input>
            </b-field>
          </b-tab-item>
        </template>
      </b-tabs>
    </section>
  </div>
</template>
<script>
import NotifBlock from "./notifBlock.vue";
export default {
  name: "notifications",
  props: ["value"],
  components: { NotifBlock },
  data() {
    return { activeTab: 0, isLoaded: false };
  },
  mounted() {
    this.$nextTick(() => {
      this.computedValue.errors = this.computedValue.errors || {};
      this.computedValue.success = this.computedValue.success || {};
      this.computedValue.failure = this.computedValue.failure || {};
      this.computedValue.sms = this.computedValue.sms || {};
      this.computedValue.success.active =
        this.computedValue.success.active == undefined ? true : null;
      this.computedValue.success.active =
        this.computedValue.success.active == undefined ? true : null;
      this.computedValue.success.active =
        this.computedValue.success.active == undefined ? true : null;

      this.isLoaded = true;
    });
  },
  watch: {
    activeTab() {
      this.$router.push({
        query: { ...this.$route.query, notifTab: this.activeTab }
      });
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.$props.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  }
};
</script>
<style>
.b-checkbox {
  margin-right: 40px;
}
</style>