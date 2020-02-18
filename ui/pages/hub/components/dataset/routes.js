import Datasets from './index.vue';
import New from "./upsert.vue";
import List from "./list.vue";
import Help from "./help.vue";
export default {
    name:"datasetsIndex",
    path: "/dataset",
    component: Datasets,
    
    children: [{
        path: 'list',
        component: List,
        name:"datasetsList", 
        meta:{title:"Datasets"}
    }, {
        path: 'upsert',
        component: New,
        name:"UpsertDataset",
        meta:{title:"Upsert Dataset"}
    }, {
        path: "help",
        component: Help,
        name:"DatasetHelp",
        meta:{title:"Datasets docs"}
    }]
}