#!/usr/bin/env node

var App = require("../lib").default;

try {
  var app = new App(process.argv, process.cwd());
} catch (err) {
  process.exit(1);
}

app
  .run()
  .then(code => {
    process.exit(code);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
