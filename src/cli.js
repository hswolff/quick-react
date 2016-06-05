#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');

const cwd = process.cwd();

yargs
  .command('run <filename>', 'run it', {}, (argv) => {
    const entryPath = path.join(cwd, argv.filename);
    require('./start')(entryPath);
  })
  .command('build <filename>', 'build it', {}, (argv) => {
    const entryPath = path.join(cwd, argv.filename);
    require('./build')(entryPath);
  })
  .command('new [path]', 'new app', {}, (argv) => {
    const fullPath = path.join(cwd, argv.path || '.');
    require('./new')(fullPath);
  })
  .help()
  .default('help')
  .argv;
