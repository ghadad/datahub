const menu = function (routes) {
    console.log(routes)
    let children = []
    let uriPath = routes.path
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
                routing: "/project",
                children: children
            }, {
                title: "Datasets",
                icon: "move_to_inbox",
                routing: "/dataset"
            }, {
                title: "Configuration",
                icon: "move_to_inbox",
                routing: "/config"
            },
            {
                title: "jobs",
                icon: "move_to_inbox",
                routing: "/job"
            },
            {
                title: "API-s",
                icon: "move_to_inbox",
                routing: "/api"
            },
            {
                title: "Docs",
                icon: "import_contacts",
                routing: "/projects"
            }
        ]
    }
};

export default menu;