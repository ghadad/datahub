import Interfaces from './list.vue';
import Upsert from "./upsert.vue";
import Help from "./help.vue";

import Jobs from "./jobs.vue"

export default [{
    name: "interfaces",
    path: "/interfaces",
    component: Interfaces,
    meta: {
        title: "Interfaces "
    }
}, {
    path: '/interface/upsert',
    name: "interfaceUpsert",
    component: Upsert,
    meta: {
        title: "Upsert interface "
    },
}, {
    path: "help",
    component: Help
}];