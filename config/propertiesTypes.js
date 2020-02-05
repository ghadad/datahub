module.exports = {
    nosql: [{
        type: "text"
    }, {
        type: "number"
    }],
    oracle: [{
            type: "varchar"
        }, {
            type: "varchar2",
            size: true
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
    mysql: [{
            type: "text"
        }, {
            type: "float"
        },
        {
            type: "decimal"
        },
        {
            type: "datatime"
        },
        {
            type: "int"
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
        type: "text"
    }, {
        type: "number"
    }]
}