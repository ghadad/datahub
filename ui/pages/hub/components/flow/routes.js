import Index from "./index.vue";
import Collector from "./collector.vue";
import Mapping from "./mapping.vue";
import Discover from "./discover.vue";

export default {
    path: "/project/explore/:project/flow/:flow/", 
    component: Index,
    name: "flow",
    children:[{
        path: "collector",
        component: Collector,
        name: "collector",
    },{
        path: "mapping",
        component: Mapping,
        name: "mapping",
    },{
        path: "discover",
        component: Discover,
        name: "discover",
    }]
}