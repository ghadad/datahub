import Databases from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Edit from "./edit.vue";
import Help from "./help.vue";


export default {
    name:"database",
    path: "/database",
    component: Databases,
    
    children: [{
        path: 'list',
        component: List,
        meta:{title:"Databases"}
    }, {
        path: 'upsert',
        component: New,
        name:"UpsertDatabse",
        meta:{title:"Upsert Database"}
    }, {
        path: "help",
        component: Help,
        name:"databsesHelp",
        meta:{title:"Databasess docs"}

    }]
}