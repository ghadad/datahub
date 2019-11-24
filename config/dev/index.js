const path = require("path");
module.exports = {
    oracle: {   
        defaultGroup: "db1",
        sqlDirectory: path.resolve(__base, "sql"),
        pools: [
            {
                poolAlias: "db1",
                user: "******",
                password: "*******",
                connectString: "******"
              }],
            usage: [{
                poolAlias: "db2",
                pools: 1,
                user: "******",
                password: "******",
                connectString: "******",
                _enableStats: true,
                poolMax: 4,
                poolMin: 4,
                poolIncrement: 0
              },
        ]

    }
}
