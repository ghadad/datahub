"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import RouterService from "@/services/routerService.js";

import Home from "../components/pages/home.vue";
import NotFound from "@/components/pages/notFound.vue";

import Interfaces from "../components/interface/routes.js";


let rs = new RouterService();
rs.add([Interfaces, {
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