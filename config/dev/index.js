const upath = require("upath");
const os = require("os");
module.exports = {
    server: {
        port: 3000,
        hostname: os.hostname()
    },
    systemDbPath: upath.join(__app.base, "system.db"),
    projectsPath: upath.join(__app.base, "system.db", "projects")

}