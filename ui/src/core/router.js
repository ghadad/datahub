"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/pages/home";
Vue.use(VueRouter);
export default new VueRouter({
	mode: "hash",
	routes: [
		{ path: "/", component: Home },	
		// { path: "/users", component: User, meta: { needRole: "admin" } },
		//{ path: "*", component: NotFound }
	]
});