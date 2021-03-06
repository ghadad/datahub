const upath = require("upath");
const os = require("os");
module.exports = {
    server: {
        port: 8080,
        hostname: os.hostname()
    },
    systemDbPath: upath.join(__app.base, "system.db"),
    projectsPath: upath.join(__app.base, "system.db", "projects"),
    couchDbUrl: 'http://admin:password@localhost:5984',
    couchDbUrl2: 'http://localhost:5984',
    couchSysDb: 'http://admin:password@localhost:5984'
}