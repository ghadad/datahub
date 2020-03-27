module.exports = {
    nosql: [{
        type: "text"
    }, {
        type: "integer"
    }, {
        type: "number"
    }],
    oracle: [{
            type: "NCHAR",
            noSqlType: "text"
        }, {
            type: "NVARCHAR2",
            size: true,
            noSqlType: "text"
        },
        {
            type: "NUMBER",
            noSqlType: "number"
        },
        {
            type: "DATE",
            noSqlType: "date"
        },
        {
            type: "DATETIME",
            noSqlType: "datetime"
        },
        {
            type: "TIMESTAMP",
            noSqlType: "timestamp"
        },
        {
            type: "CHAR",
            noSqlType: "text"

        }, {
            type: "VARCHAR",
            noSqlType: "text"

        }, {
            type: "VARCHAR2",
            noSqlType: "text"

        }, {
            type: "LOB",
            noSqlType: "text"
        }, {
            type: "CLOB",
            noSqlType: "text"
        }
    ],
    mysql: [{
            type: "NUMERIC",
            noSqlType: "number"
        }, {
            type: "SMALLINT",
            noSqlType: "integer"
        },
        {
            type: "DECIMAL",
            noSqlType: "number"
        },
        {
            type: "INTEGER",
            noSqlType: "integer"
        },
        {
            type: "DATE",
            noSqlType: "date"
        },
        {
            type: "DATETIME",
            noSqlType: "datetime"
        },
        {
            type: "TIMESTAMP",
            noSqlType: "timestamp"
        },
        {
            type: "TEXT",
            noSqlType: "text"
        },
        {
            type: "CHAR",
            noSqlType: "text"
        },
        {
            type: "VARCHAR",
            noSqlType: "text"
        }, {
            type: "BLOB",
            noSqlType: "text"
        }
    ],
    postgres: [{
            type: "varchar",
            noSqlType: "text"
        },
        {
            type: "varchar2",
            noSqlType: "text"
        },
        {
            type: "date",
            noSqlType: "date"
        },
        {
            type: "datatime",
            noSqlType: "datetime"
        },
        {
            type: "number",
            noSqlType: "number"
        }
    ],
    sqlite: [{
        type: "INTEGER",
        noSqlType: "integer"
    }, {
        type: "REAL",
        noSqlType: "number"
    }, {
        type: "TEXT",
        noSqlType: "text"
    }, {
        type: "BLOB",
        noSqlType: "text"
    }]
}