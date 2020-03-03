#!nnode

const upath = require("upath");
const yargs = require("yargs");
const delay = require("delay");

var argv = yargs
  .usage("Usage: $0 -e dev")
  .option("env", {
    alias: "e",
    describe: "env code [dev|qa|prod]",
    type: "string",
    demand: true
  })
  .option("log-level", {
    alias: "l",
    demand: false,
    describe: "log level",
    type: "string"
  }).argv;


const main = require(upath.join(__dirname, "..", "lib/main"));
const Dataset = require(upath.join(__dirname, "..", "lib/dataset"));


main.init(argv).then(async () => {
  let dbs = await __app.couchDb.getAll("databases")

  for (let db of dbs) {
    __app.dal.init(db._id, db.db);
  }

  __app.logger.info("dal:", __app.dal.dbs);
  let dataset = new Dataset();
  let ds = await dataset.getAll();
  let k = __app.dal.getDal("maria1");

  console.log(await k.raw("SELECT 1 + 1 FROM DUAL", {}));
  console.log(await __app.dal.query("SELECT 1 + 1 FROM DUAL", {}, {
    dbAlias: "maria1"
  }));

  for (d of ds) {
    console.log(d)
    console.log(await __app.dal.query(d.query, {}, {
      dbAlias: "maria1"
    }));
  }
  process.exit()
  //  dbAlias: "maria1"
  //})
}).catch(err => {
  __app.logger.error("dataset test  failed:", err.stack);
  process.exit(-1)
});