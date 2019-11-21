const path = require("path");
module.exports = {
    oracle: {   
        defaultGroup: "db1",
        sqlDirectory: path.resolve(__base, "sql"),
        pools: [
            {
                poolAlias: "db1",
                user: "pelmafc",
                password: "pelmafc",
                connectString: "pet7maf"
              }],
            usage: [{
                poolAlias: "db2",
                pools: 1,
                user: "pelusg1c",
                password: "pelusg1c",
                connectString: "pet7usg1",
                _enableStats: true,
                poolMax: 4,
                poolMin: 4,
                poolIncrement: 0
              },
        ]

    }
}