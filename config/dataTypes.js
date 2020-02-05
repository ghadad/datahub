module.exports = {
    nosql: [{
        type: "text"
    }, {
        type: "number"
    }],
    oracle: [{
            type: "NCHAR"
        }, {
            type: "NVARCHAR2",
            size: true
        },
        {
            type: "NUMBER"
        },
        {
            type: "DATE"
        },
        {
            type: "DATETIME"
        },
        {
            type: "TIMESTAMP"
        },
        {
            type: "CHAR",
            
        },   {
            type: "VARCHAR",
            
        }, {
            type: "VARCHAR2",
            
        }, {
            type: "LOB"
        }, {
            type: "CLOB"
        }
    ],
    mysql: [{
            type: "NUMERIC"
        }, {
            type: "SMALLINT"
        },
        {
            type: "DECIMAL"
        },
        {
            type: "INTEGER"
        },
        {
            type: "DATE"
        },
        {
            type: "DATETIME"
        },
        {
            type: "TIMESTAMP"
        },
        {
            type: "TEXT"
        },
        {
            type: "CHAR"
        },
        {
            type: "VARCHAR"
        }, {
            type: "BLOB"
        }
    ],
    postgres: [{
            type: "varchar"
        },
        {
            type: "varchar2"
        },
        {
            type: "date"
        },
        {
            type: "datatime"
        },
        {
            type: "number"
        }
    ],
    sqlite: [{
        type: "INTEGER"
    }, {
        type: "REAL"
    }, {
        type: "TEXT"
    }, {
        type: "BLOB"
    }]
}