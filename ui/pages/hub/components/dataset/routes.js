import Datasets from './index.vue';
import Upsert from './upsert.vue';


export default [{
        name: "datasetsIndex",
        path: "/dataset",
        component: Datasets,
        meta: {
            title: "Predefined data sets"
        }
    },
    {
        name: "upsertDataset",
        path: "/dataset/upsert",
        component: Upsert,
        meta: {
            title: "Upsert dataset"
        }
    }
]