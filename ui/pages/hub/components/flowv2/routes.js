import Index from "./index.vue";
import Collector from "./collector.vue";
import Tester from "./tester.vue";

import FlowConfig from "./flow.config.vue";

import Mapping from "./mapping.vue";
import Finalize from "./finalize.vue";

export default {
    path: "/project/explore/:project/flow/:flow/",
    component: Index,
    name: "flow",
    children: [{
        path: "/:project/:flow/flow-config",
        component: FlowConfig,
        name: "flowConfig",
        meta: {
            title: "Flow setting"
        }
    }, {
        path: "collector",
        component: Collector,
        name: "collector",
        meta: {
            title: "Collector setting "
        }
    }, {
        path: "test/:tester",
        component: Tester,
        name: "tester_collector",
        meta: {
            title: "Tesetr"
        }
    }, {
        path: "test/:tester",
        component: Tester,
        name: "tester_mapping",
        meta: {
            title: "Tesetr"
        }
    }, {
        path: "mapping",
        component: Mapping,
        name: "mapping",
        meta: {
            title: "Mapping rules"
        }
    }, {
        path: "finalize",
        component: Finalize,
        name: "finalize",
        meta: {
            title: "Finalize"
        }
    }]
}