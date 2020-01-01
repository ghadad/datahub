const upath = require("upath");
module.exports = {
    appName: "Datahub reactor",
    git: "http://..............",
    projectsPath: upath.join(__app.base, "projects"),
    sources: [{
            type: "csv",
            description: "csv"
        }, {
            type: "query",
            description: "sql Query"
        },
        {
            type: "restapi",
            description: "restapi"
        }
    ]
}