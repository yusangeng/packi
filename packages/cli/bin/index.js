#!/usr/bin/env node

const{ App } = require("../cjs");

try {
  const app = new App(process.argv, process.cwd());
  
  app
  .run()
  .then(code => {
    process.exit(code);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

} catch (err) {
  console.log(err)
  process.exit(1);
}