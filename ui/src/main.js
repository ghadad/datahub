import Vue from 'vue'
import Lodash from 'lodash';
Vue.prototype.$_ = Lodash;
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import {
    FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";

Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(Buefy, {
    defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas',
})

import VueCodeMirror from 'vue-codemirror-lite'

Vue.component('codemirror', VueCodeMirror.codemirror);

import Http from "@/services/http";
Vue.prototype.$http = Http;
Vue.prototype.$createProject = async function (project,  routeParams = {}) {
    let self = this;

    let res = await self.$http.post("projects", project);
    self.$set(project, '_rev', res.rev);
    self.$root.$emit("global-ok", res.ok || false);
    if (routeParams.name)
        self.$router.push(routeParams);
};
Vue.prototype.$saveProject = async function (project, routeParams = {}) {
    let self = this;
    let res = await self.$http.put("projects", project);
    self.$set(project, '_rev', res.rev);
    self.$root.$emit("global-ok", res.ok || false);
    if (routeParams.name)
        self.$router.push(routeParams);
};

Vue.prototype.$saveModel = async function (model,data, routeParams = {}) {
    let self = this;
    let res = await self.$http.put(model, data);
    self.$set(data, '_rev', res.rev);
    self.$root.$emit("global-ok", res.ok || false);
    if (routeParams.name)
        self.$router.push(routeParams);
};


Vue.prototype.$normalizeName = function (str = "") {
    return str
        .trim()
        .replace(/-/g, "_")
        .replace(/\s+/g, "_")
        .toLowerCase();
}
Vue.prototype.$saveInterface = async function () {
    await 1;
};
Vue.prototype.$eval = function (expr) {
    return eval(expr)
};

import ValidationProvider from "./validate.js";
import Breadcrumb from "./components/breadcrumb.vue";
Vue.component('breadcrumb', Breadcrumb)
Vue.component('ValidationProvider', ValidationProvider);


export default Vue;