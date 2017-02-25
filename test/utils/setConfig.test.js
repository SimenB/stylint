'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const stripJsonComments = require('strip-json-comments');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;

describe('Set Config should:', () => {
  process.argv[2] = '-c';
  process.argv[3] = '.stylintrc';
  const testMethod = app.setConfig('.stylintrc');
  const testConfig = JSON.parse(stripJsonComments(fs.readFileSync(path.resolve(__dirname, '../..//.stylintrc'), 'utf-8')));

  it('update config state if passed a valid path', () => {
    assert.deepEqual(testMethod, testConfig);
  });

  it('throw if passed invalid path', () => {
    assert.throws(
      app.setConfig,
      TypeError,
      `setConfig err. Expected string, but received: ${typeof dir}`
    );
  });
});
