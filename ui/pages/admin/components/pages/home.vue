<template>
  <div class="hello">
<section class="hero is-dark">
  <div class="hero-body">
    <div class="container">
      <h1 class="title is-1">
        ADMIN BOARD
      </h1>
      <h2 class="subtitle">
          Manage databases users and environments  for the the Datahub functionality </h2>
          <p>
          <router-link :to='{name:"database"}' class="button is-rounded">Manage databases</router-link>
          <router-link :to='{name:"users"}' class="button is-rounded">Manage Users & RBAC</router-link>
          <router-link :to='{name:"hosts"}' class="button is-rounded">Manage hosts</router-link>
          </p>
    </div>
  </div>
</section>   </div>
</template>
<style scoped>
.button { margin-right:10px}
</style>