'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.quiet = true;
app.state.watching = true;
app.config.namingConventionStrict = true;

const conventionTest = app.lintMethods.namingConvention.bind(app);

describe('naming convention', () => {
  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if correct naming convention: lowercase-dash', () => {
    app.state.conf = 'lowercase-dash';

    assert.equal(false, conventionTest('$var-name-like-this ='));
    assert.equal(false, conventionTest('.class-name-like-this'));
    assert.equal(false, conventionTest('#id-name-like-this'));
    assert.equal(false, conventionTest('.block-{$class-name}'));
    assert.equal(false, conventionTest('#{$class-name}'));
    assert.equal(false, conventionTest('#block-{$class-name}'));
    assert.equal(false, conventionTest(':{$const-name}'));
    assert.equal(false, conventionTest('$constname'));
    assert.equal(false, conventionTest('$constname = "Font Name"'));
  });

  it('false if correct naming convention: lowercase_underscore', () => {
    app.state.conf = 'lowercase_underscore';

    assert.equal(false, conventionTest('$const_name_like_this ='));
    assert.equal(false, conventionTest('.class_name_like_this'));
    assert.equal(false, conventionTest('#id_name_like_this'));
    assert.equal(false, conventionTest('.block_{$const_name}'));
    assert.equal(false, conventionTest('#{$const_name}'));
    assert.equal(false, conventionTest('#block_{$const_name}'));
    assert.equal(false, conventionTest(':{$const_name}'));
    assert.equal(false, conventionTest('$constname'));
    assert.equal(false, conventionTest('$constname = "Font Name"'));
  });

  it('false if correct naming convention: camelCase', () => {
    app.state.conf = 'camelCase';

    assert.equal(false, conventionTest('$varNameLikeThis ='));
    assert.equal(false, conventionTest('.classNameLikeThis'));
    assert.equal(false, conventionTest('#idNameLikeThis'));
    assert.equal(false, conventionTest('.block{$varName}'));
    assert.equal(false, conventionTest('#{$varName}'));
    assert.equal(false, conventionTest('#block{$varName}'));
    assert.equal(false, conventionTest(':{$varName}'));
    assert.equal(false, conventionTest('$varname'));
    assert.equal(false, conventionTest('$varname = "Font-name"'));
  });

  it('false if correct naming convention: BEM', () => {
    app.state.conf = 'BEM';

    assert.equal(false, conventionTest('$var-name__like-this ='));
    assert.equal(false, conventionTest('.class-name__like-this'));
    assert.equal(false, conventionTest('#id-name__like-this'));
    assert.equal(false, conventionTest('.block-{$var__name}'));
    assert.equal(false, conventionTest('#{$var__name}'));
    assert.equal(false, conventionTest(':{$var__name}'));
    assert.equal(false, conventionTest('#block__{$var-name}'));
    assert.equal(false, conventionTest('#block{$var-name}'));
    assert.equal(false, conventionTest('$varname'));
    assert.equal(false, conventionTest('$varname = "Font Name"'));
  });

  it('true if NOT correct naming convention: lowercase-dash', () => {
    app.state.conf = 'lowercase-dash';

    assert.ok(conventionTest('$var_name_like_this ='));
    assert.ok(conventionTest('.class_name_like_this'));
    assert.ok(conventionTest('#id_name_like_this'));
    assert.ok(conventionTest('.block_{$var-name}'));
    assert.ok(conventionTest('#{$var_name}'));
    assert.ok(conventionTest('#block_{$var_name}'));
    assert.ok(conventionTest(':{$var_name}'));
    assert.ok(conventionTest('.block_{$var-name}'));
  });

  it('true if NOT correct naming convention: lowercase_underscore', () => {
    app.state.conf = 'lowercase_underscore';

    assert.ok(conventionTest('$const-name-like-this ='));
    assert.ok(conventionTest('.class-name-like-this'));
    assert.ok(conventionTest('#id-name-like-this'));
    assert.ok(conventionTest('.block-{$const-name}'));
    assert.ok(conventionTest('#{$const-name}'));
    assert.ok(conventionTest('#block-{$const-name}'));
    assert.ok(conventionTest(':{$const-name}'));
    assert.ok(conventionTest('.block-{$constName}'));
    assert.ok(conventionTest('#{$constName}'));
    assert.ok(conventionTest('#block-{$constName}'));
    assert.ok(conventionTest(':{$constName}'));
    assert.ok(conventionTest('.block_{$const-name}'));
  });

  it('true if NOT correct naming convention: camelCase', () => {
    app.state.conf = 'camelCase';

    assert.ok(conventionTest('$const-name-like-this ='));
    assert.ok(conventionTest('.class-name-like-this'));
    assert.ok(conventionTest('#id-name-like-this'));
    assert.ok(conventionTest('$const_name_like_this ='));
    assert.ok(conventionTest('.class_name_like_this'));
    assert.ok(conventionTest('#id_name_like_this'));
    assert.ok(conventionTest('.block{$const-name}'));
    assert.ok(conventionTest('#{$const-name}'));
    assert.ok(conventionTest('#block{$const-name}'));
    assert.ok(conventionTest(':{$const-name}'));
    assert.ok(conventionTest('.block{$const_name}'));
    assert.ok(conventionTest('.block{$const-name}'));
    assert.ok(conventionTest('#{$const_name}'));
    assert.ok(conventionTest(':{$const_name}'));
    assert.ok(conventionTest('.block_{$const-name}'));
  });

  it('true if not correct naming convention: BEM', () => {
    app.state.conf = 'BEM';

    assert.ok(conventionTest('.classNameLikeThis'));
    assert.ok(conventionTest('#id_name_like_this'));
    assert.ok(conventionTest('.block_{$constName}'));
    assert.ok(conventionTest('#{$constName}'));
    assert.ok(conventionTest('#block_{$const-name}'));
    assert.ok(conventionTest('.block_{$const-name}'));
  });

  describe('strict turned off', () => {
    before(() => {
      app.config.namingConventionStrict = false;
    });

    it('false if using classes or ids', () => {
      assert.equal(false, conventionTest('.class_name_like_this'));
      assert.equal(false, conventionTest('#id_name_like_this'));
      assert.equal(false, conventionTest('.class-name-like-this'));
      assert.equal(false, conventionTest('#id-name-like-this'));
      assert.equal(false, conventionTest('.class-name-like-this'));
      assert.equal(false, conventionTest('#id-name-like-this'));
    });

    it('false if custom convention matches', () => {
      app.state.conf = '[$]varExample';
      assert.equal(false, conventionTest('$varExample'));
    });

    it('true if custom convention doesnt match', () => {
      app.state.conf = 'somethin';
      assert.equal(true, conventionTest('$var_name_like_this'));
    });
  });
});
