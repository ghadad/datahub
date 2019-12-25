import Databases from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Edit from "./edit.vue";
import Help from "./help.vue";


export default {
    path: "/database",
    component: Databases,
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