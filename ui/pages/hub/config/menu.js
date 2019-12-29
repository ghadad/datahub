const menu = function (routes) {
    let children = []
    if (routes.path.match(/project.explore/))
        children = [{
            title: "Entities",
            icon: "move_to_inbox",
            routerLink: "entitiy"
        }, {
            title: "Flows",
            icon: "move_to_inbox",
            routerLink: "flows"
        }, {
            title: "Jobs",
            icon: "move_to_inbox",
            routerLink: "jobs"
        }];

    return {
        leftMenu: [{
                title: "Projects",
                icon: "storage",
                routerLink: "/project",
                children: children
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