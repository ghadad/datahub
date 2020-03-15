import Datasets from './index.vue';
import Upsert from './upsert.vue';


export default [{
        name: "sqlIndex",
        path: "/sql",
        component: Datasets,
        meta: {
            title: "Predefined sql statements"
        }
    },
    {
        name: "upsertSql",
        path: "dataset/upsert",
        component: Upsert,
        meta: {
            title: "Upsert dataset"
        }
    }
]