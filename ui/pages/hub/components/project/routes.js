import Projects from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Help from "./help.vue";
import Explore from "./explore.vue"

export default {
    name:"projects",
    path: "/project",
    component: Projects,
    children: [{
        path: 'explore/:project',
        component: Explore
    }, {
        path: 'list',
        component: List
    }, {
        path: 'upsert',
        component: New
    }, {
        path: "help",
        component: Help
    }]
}