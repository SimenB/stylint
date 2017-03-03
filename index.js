'use strict';

// our stampit modules
const stampit = require('stampit');
const fs = require('fs');

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object, the app
// appropriately namespaced, with methods on the prototype,
// and `this` set consistently (ie, available throughout the app)
//
// basic app flow below
// init() -> read() -> parse() -> lint() -> done()
// init() -> watch() -> read() -> parse() -> lint() -> done()

/**
 * @description Main stylint kickoff function.
 * @param {string} path - Custom path if used programmatically.
 * @param {Object} config - Config if used programmatically.
 * @param {Function} [callback] - A callback called just before exiting the process if not watching.
 * @returns {Object} The composed stylint object.
 */
const stylint = function(path, config, callback) {
  return stampit().compose(
    require('./src/core/'),
    require('./src/checks/'),
    require('./src/state/'),
    stampit()
      .enclose(function() {
        let pkg = null;
        try {
          // TODO: Use pkg-up
          // eslint-disable-next-line import/no-dynamic-require
          pkg = require(`${process.cwd()}/package.json`);
        } catch (err) {
          // no output
        }

        // set safe path defaults
        if (typeof path === 'undefined') {
          this.state.path = './';
        } else if (path instanceof Array || typeof path === 'string') {
          this.state.path = path;
        }

        // look for a stylintignore array
        // for ignoring specific files
        // first look in package.json
        // then look for .stylintignore in the main dir
        if (pkg !== null && typeof pkg.stylintignore !== 'undefined' && pkg.stylintignore instanceof Array) {
          this.state.exclude = pkg.stylintignore;
        } else {
          try {
            const stylintIgnore = fs.readFileSync(`${process.cwd()}/.stylintignore`);
            this.state.exclude = stylintIgnore.toString().split('\n').filter(d => d);
          } catch (err) {
            // do no-thing
          }
        }

        this.customConfig = typeof config === 'object' ? config : false;
        this.callback = callback || function() {};
      })
      .enclose(require('./src/core/init'))
  );
};

const api = function(config) {
  return stylint().create({}, { config });
};

module.exports = stylint;
module.exports.api = api;
