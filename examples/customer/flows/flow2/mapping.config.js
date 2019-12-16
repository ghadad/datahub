module.exports = [{
    hash: true,
    key: "name",
    goTo: "firstName",
    validate: [
      ['maxLength', 10]
    ]
  },
  {
    hash: true,
    key: "name",
    handler: (v, r, n) => v + ":" + v,
    goTo: "lastName"
  },
  {
    hash: false,
    const: 12345,
    goTo: "companyId",
    validate: [
      ['in', 123456, 12345]
    ]
  },
  {
    hash: false,
    query: "select 1 as val  from dual",
    //poolAlias :"any",
    goTo: "queryResult",
    validate: []
  },
  {
    hash: false,
    package: "mypackage.run()",
    handler: (v, r, n) => v.length,
    //poolAlias :"any",
    goTo: "queryResult",
    validate: [
      ['lt', 1, 4],
      function (v, r, n) {
        return true;
      }
    ],
  },
  {
    const: "4",
    //poolAlias :"any",
    goTo: "queryResult",
    transform: [
      ['toNumber'], (v, r, n) => v + v
    ],
    validate: [
      ['between', 4, 9],
      ['gt', 1]
    ],
    drop: [
      ['isNull'],
      ['gt', 5000],
      (r, n, v) => true
    ]
  }
]