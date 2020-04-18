<template>
  <div>
    <h1 class="title is-4">Template engine : {{type}}</h1>
  </div>
</template>
<script>
export default {
  name: "templateOutput",
  props: ["value", "type"]
};
</script>