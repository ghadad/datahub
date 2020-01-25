import Index from "./index.vue";
import Collector from "./collector.vue";
import FlowConfig from "./flow.config.vue";

import Mapping from "./mapping.vue";
import Discover from "./discover.vue";

export default {
    path: "/project/explore/:project/flow/:flow/",
    component: Index,
    name: "flow",
    children: [{
        path: "flow-config",
        component: FlowConfig,
        name: "flowConfig",
        meta:{title:"flowConfig"}
    },{
        path: "collector",
        component: Collector,
        name: "collector",
        meta:{title:"Flow"}
    }, {
        path: "mapping",
        component: Mapping,
        name: "mapping",
        meta:{title:"Mapping rules"}
    }, {
        path: "discover",
        component: Discover,
        name: "discover",
        meta:{title:"Discover"}
    }]
}