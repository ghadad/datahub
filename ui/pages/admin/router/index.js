"use strict";
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/pages/home.vue";
import NotFound from "../components/pages/notFound.vue";
import Projects from "../components/project/routes.js";
import Databases from "../components/database/routes.js";
import Job from "../components/job/routes.js";
import Api from "../components/api/routes.js";
import Config from "@/components/pages/config.vue";

Vue.use(VueRouter);
export default new VueRouter({
	mode: "hash",
	routes: [Projects, Databases, Job, Api, {
			name: "config",
			path: "/config",
			component: Config
		},
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