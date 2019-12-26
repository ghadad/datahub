import Projects from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Edit from "./edit.vue";
import Help from "./help.vue";


export default {
    path: "/project",
    component: Projects,
    children: [{
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