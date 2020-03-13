const menu = function (routes) {

    let children = []
    if (routes.params.project)
        children = [{
                title: "Project:" + routes.params.project,
                icon: "move_to_inbox",
                routing: {
                    name: "explore",
                    params: routes.params
                },
                class: "header"
            },
            {
                title: "Entities",
                icon: "move_to_inbox",
                routing: {
                    name: "entities",
                    params: routes.params
                },
            }, {
                title: "Flows",
                icon: "move_to_inbox",
                routing: {
                    name: "flows",
                    params: routes.params
                },
            }, {
                title: "Jobs",
                icon: "move_to_inbox",
                routing: {
                    name: "jobs",
                    params: routes.params
                },
            }
        ];

    return {
        leftMenu: [{
                title: "Projects",
                icon: "storage",
                routing: {
                    name: "projects"
                },
                children: children
            }, {
                title: "Datasets",
                icon: "move_to_inbox",
                routing: {
                    name: "datasetsIndex",
                    meta: {
                        title: "Data sets"
                    }
                },
            },{
                title: "Sql statements",
                icon: "move_to_inbox",
                routing: {
                    name: "sqlIndex",
                    meta: {
                        title: "Sql statements"
                    }
                },
            }, {
                title: "Configuration",
                icon: "move_to_inbox",
                routing: {
                    name: "datasetsIndex"
                },
            },
           
            {
                title: "Docs",
                icon: "import_contacts",
                routing: {
                    name: "datasetsIndex",
                    params: routes.params
                },
            }
        ]
    }
};

export default menu;