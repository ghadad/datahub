<template>
<div>

<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul v-if="hasBreadCrumbs">
    <li v-for="b in list" :key="b.name" :class="b.active ?'is-active' :''">
            <router-link v-if="!b.active" :to="{name:b.name,params:$route.params}">{{b.title|| b.name}}</router-link>
            <a href="#" v-if="b.active" aria-current="page">{{b.title}}</a>
            </li>
  </ul>
</nav>
</div>
</template>
<script>
export default {
    data:function(){ 
        return {
          list:[],
          hasBreadCrumbs :false
        }
    },

    mounted:function(){
        let self = this;
       self.$root.$on("breadcrumbs",function(data){
           self.list = data;
           self.hasBreadCrumbs = true;
       }) 
        self.hasBreadCrumbs=false;
    },
 computed:{
     
 }   
}
</script>