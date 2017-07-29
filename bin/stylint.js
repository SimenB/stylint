#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const stylint = require('../');

const options = yargs
  .usage('Usage: $0 [dir | file] ')
  .option('watch', {
    alias: 'w',
    describe: 'Watch file or directory and run lint on change',
    type: 'boolean',
  })
  .option('config', {
    alias: 'c',
    describe: 'Location of custom config file',
    type: 'string',
  })
  .option('strict', {
    alias: 's',
    describe: 'Run all tests, regardless of config',
    type: 'boolean',
  })
  .option('formatter', {
    alias: 'r',
    describe: 'Custom formatter name or path',
    type: 'string',
    requiresArg: true,
  })
  .version(() => `Stylint version: ${require('../package').version}`)
  .alias('version', 'v')
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .example('$0 directory', 'Run Stylint on all .styl-files in "directory"')
  .epilogue('GPL-3.0 License').argv;

const stylintInstance = stylint().create(
  {},
  {
    watch: options.watch,
    config: options.config,
    strict: options.strict,
    formatter: options.formatter,
  },
  options._.length > 1 ? options._ : options._[0]
);

// to allow instantiation without doing anything, manually call read
if (!options.watch) {
  stylintInstance.read();
}
