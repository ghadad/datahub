"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/pages/home.vue";
import NotFound from "../components/pages/notFound.vue";
import Databases from "../components/database/routes.js";
import Config from "../components/config/routes.js";


Vue.use(VueRouter);
export default new VueRouter({
	mode: "hash",
	routes: [Databases, Config,
		{
			name: "home",
			path: "/",
			component: Home
		},
		// { path: "/users", component: User, meta: { needRole: "admin" } },
		{
			path: "*",
			component: NotFound
		}
	]
});