
import Projects from './index.vue';
import New from "./new.vue";
import List from "./list.vue";
import Edit from "./edit.vue";
import Help from "./help.vue";


export default {
        path: "/project",
        component: Projects,
        children: [{
            path: 'list',
            component: List
        },{
            path: 'new',
            component: New
        },{
            path:"help",
            component: Help
        }]
}