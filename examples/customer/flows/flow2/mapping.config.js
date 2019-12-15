module.exports = [{
    hash: true,
    key: "name",
    goTo: "firstName",
    valid: __app.validator.maxlen(10)
  },
  {
    hash: true,
    key: "name",
    handler: (r, n, v) => v + ":" + v,
    goTo: "lastName"
  },
  {
    hash: false,
    const: 12345,
    goTo: "companyId",
    valid: __app.validator.in(12345, 43221),
  },
  {
    hash: false,
    query: "select 1 as val  from dual",
    //poolAlias :"any",
    goTo: "queryResult",
    valid: __app.validator.lt(4),
  },
  {
    hash: false,
    package: "mypackage.run()",
    handler: (r, n, v) => v.length,
    //poolAlias :"any",
    goTo: "queryResult",
    valid: __app.validator.lt(4),
  },
  {
    const: "4",
    //poolAlias :"any",
    goTo: "queryResult",
    transform: __app.lodash.toNumber(4),
    valid: __app.validator.between(3, 8),
    drop: [__app.validator.notnull(), __app.validator.between(10, 13)]
  }
]