"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import RouterService from "@/services/routerService.js";

import Home from "../components/pages/home.vue";
import NotFound from "@/components/pages/notFound.vue";

import Projects from "../components/project/routes.js";


let rs = new RouterService();
rs.add([Projects, {
		name: "home",
		path: "/",
		component: Home
	},
	{
		path: "*",
		component: NotFound
	}
])

Vue.use(VueRouter);
export default new VueRouter({
	mode: "hash",
	routes: rs.get()
});