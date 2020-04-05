import Projects from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Help from "./help.vue";
import Explore from "./explore.vue"
import Entities from "./entities.vue"
import Flows from "./flows.vue"
import Jobs from "./jobs.vue"

export default [{
    name: "projects",
    path: "/project",
    component: Projects,
    meta: {
        title: "HUB projects "
    },
    children: [{
        path: 'explore/:project',
        component: Explore,
        name: "explore"

    }, {
        path: 'list',
        name: "projects",
        component: List,
        meta: {
            title: "HUB projects "
        },
    }, {
        path: 'upsert',
        name: "projectUpsert",
        component: New,
        meta: {
            title: "Upsert project "
        },
    }, {
        path: "help",
        component: Help
    }]
}, {
    path: '/project/explore/:project/entities',

    component: Entities,
    name: "entities"

}, {
    path: '/project/explore/:project/flows',

    component: Flows,
    name: "flows"

}, {
    path: '/project/explore/:project/jobs',

    component: Jobs,
    name: "jobs"

}];