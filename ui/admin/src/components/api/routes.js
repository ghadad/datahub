
import Api from './index.vue';
import New from "./new.vue";
import List from "./list.vue";
import Edit from "./edit.vue";
import Help from "./help.vue";


export default {
        path: "/api",
        component: Api,
        children: [{
            path: 'list',
            component: List
        },{
            path: 'edit',
            component: Edit
        },{
            path: 'new',
            component: New
        },{
            path:"help",
            component: Help
        }]
}