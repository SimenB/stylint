#!/usr/bin/env node

/**
 * Stylint
 * @description A basic, configurable, node based, stylus linter cli
 *              app flow below
 *              read() -> parse() -> test() -> done()
 *              watch() -> read() -> parse() -> test() -> done()
*/

'use strict';

// our stampit modules
var stampit  = require('stampit');

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object
// appropriately namespaced, with methods on the prototype, and this set correctly
var Lint = stampit().compose(
	require('./src/core/cache'),
	require('./src/core/config'),
	require('./src/core/core'),
	require('./src/core/flags'),
	require('./src/core/init'),
	require('./src/core/state'),
	require('./src/core/lintMethods'),
	require('./src/core/stateMethods'),
	require('./src/core/utils'),
	require('./src/core/valid')
).create();


// let us 'share' our light with others
module.exports = Lint;
