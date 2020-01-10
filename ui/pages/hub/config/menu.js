const menu = function (routes) {
    console.log(routes)
    let children = []
    let uriPath = routes.path
    if (routes.params.project)
        children = [{
                title: "Project:" + routes.params.project,
                icon: "move_to_inbox",
                routerLink: uriPath,
                class: "header"
            },
            {
                title: "Entities",
                icon: "move_to_inbox",
                routerLink: uriPath + "/entities"
            }, {
                title: "Flows",
                icon: "move_to_inbox",
                routerLink: uriPath + "/flows"
            }, {
                title: "Jobs",
                icon: "move_to_inbox",
                routerLink: uriPath + "/jobs"
            }
        ];

    return {
        leftMenu: [{
                title: "Projects",
                icon: "storage",
                routerLink: "/project",
                children: children
            }, {
                title: "Datasets",
                icon: "move_to_inbox",
                routerLink: "/dataset"
            }, {
                title: "Configuration",
                icon: "move_to_inbox",
                routerLink: "/config"
            },
            {
                title: "jobs",
                icon: "move_to_inbox",
                routerLink: "/job"
            },
            {
                title: "API-s",
                icon: "move_to_inbox",
                routerLink: "/api"
            },
            {
                title: "Docs",
                icon: "import_contacts",
                routerLink: "/projects"
            }
        ]
    }
};

export default menu;