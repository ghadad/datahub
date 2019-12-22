module.exports = [{
    hash: true,
    keyIndex: 1,
    goTo: "firstName",
    validate: [
      ['maxLength', 10]
    ]
  },
  {
    hash: true,
    keyIndex: 1,
    handler: (v, r, n, p) => v + ":" + v,
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
    // query: "select 1 as val  from dual",
    //poolAlias :"any",
    goTo: "queryResult",
    validate: []
  },
  {
    hash: false,
    package: "mypackage.run()",
    handler: (v, r, n, p) => v.length,
    //poolAlias :"any",
    goTo: "queryResult",
    validate: [
      ['lt', 1, 4],
      function (v, r, n, p) {
        return true;
      }
    ],
  },
  {
    const: "aaa_abb_bb",
    //poolAlias :"any",
    goTo: "allAroundProperty",
    transform: [
      ['camelCase'],
      ['kebabCase'], (v, r, n, p) => v + v
    ],
    validate: [
      ['between', 4, 9],
      ['gt', 1]
    ],
    drop: [
      ['isNull'],
      ['gt', 5000],
      (v, r, n, p) => true
    ]
  }
]