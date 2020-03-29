import Job from './index.vue';
import New from "./new.vue";
import List from "./list.vue";
import Help from "./help.vue";


export default {
    path: "/job",
    component: Job,
    children: [{
        path: 'list',
        component: List
    }, {
        path: 'new',
        component: New
    }, {
        path: "help",
        component: Help
    }]
}