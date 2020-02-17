<template>
  <section class="hero full-height is-info is-medium is-fullheight">
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">DATAHUB5</h1>
        <h2 class="subtitle">Build your dreams now !</h2>
        <section class="section">
          <div class="container">
            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <a href="/admin" class="button is-rounded">Admin panel</a>
                    <h2 class="title">Manage databases sources and hosts</h2>
                    <h3 class="subtitle">RBAC and more</h3>
                  </div>
                  <footer class="card-footer"></footer>
                </div>
              </div>

              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <a href="/hub" class="button is-rounded">Datahub panel</a>
                    <h2 class="title">Create your business entities</h2>
                    <h3 class="subtitle">Build data from any sources</h3>
                  </div>
                  <footer class="card-footer"></footer>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <a href="/interface" class="button is-rounded">Interfaces panel</a>
                    <h2 class="title">Let others enjoys your data</h2>
                    <h3 class="subtitle">Make money !</h3>
                  </div>
                </div>
                <footer class="card-footer"></footer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template> 

<script>
export default {
  name: "Home",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
.card-content .title {
  color: black !important;
}
.card-content .subtitle {
  color: darkgray !important;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
