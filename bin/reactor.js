#!/usr/bin/env node

const path = require("path");
const yargs = require("yargs");
const delay = require("delay");

const opts = {
  env: {
    alias: 'e',
    describe: 'env code',
    demandOption: true
  }
};

const options =
        yargs.options(opts)
        .help()
        .argv;

const main = require(path.resolve(__dirname, "..", "lib/main"));

main.init(options).then(async () => {

  process.exit(0)
  
}).catch(err => {
  console.error(err);
  process.exit(-1)
});
