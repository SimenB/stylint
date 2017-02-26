'use strict';

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

    expect(conventionTest('$var-name-like-this =')).toEqual(false);
    expect(conventionTest('.class-name-like-this')).toEqual(false);
    expect(conventionTest('#id-name-like-this')).toEqual(false);
    expect(conventionTest('.block-{$class-name}')).toEqual(false);
    expect(conventionTest('#{$class-name}')).toEqual(false);
    expect(conventionTest('#block-{$class-name}')).toEqual(false);
    expect(conventionTest(':{$const-name}')).toEqual(false);
    expect(conventionTest('$constname')).toEqual(false);
    expect(conventionTest('$constname = "Font Name"')).toEqual(false);
  });

  it('false if correct naming convention: lowercase_underscore', () => {
    app.state.conf = 'lowercase_underscore';

    expect(conventionTest('$const_name_like_this =')).toEqual(false);
    expect(conventionTest('.class_name_like_this')).toEqual(false);
    expect(conventionTest('#id_name_like_this')).toEqual(false);
    expect(conventionTest('.block_{$const_name}')).toEqual(false);
    expect(conventionTest('#{$const_name}')).toEqual(false);
    expect(conventionTest('#block_{$const_name}')).toEqual(false);
    expect(conventionTest(':{$const_name}')).toEqual(false);
    expect(conventionTest('$constname')).toEqual(false);
    expect(conventionTest('$constname = "Font Name"')).toEqual(false);
  });

  it('false if correct naming convention: camelCase', () => {
    app.state.conf = 'camelCase';

    expect(conventionTest('$varNameLikeThis =')).toEqual(false);
    expect(conventionTest('.classNameLikeThis')).toEqual(false);
    expect(conventionTest('#idNameLikeThis')).toEqual(false);
    expect(conventionTest('.block{$varName}')).toEqual(false);
    expect(conventionTest('#{$varName}')).toEqual(false);
    expect(conventionTest('#block{$varName}')).toEqual(false);
    expect(conventionTest(':{$varName}')).toEqual(false);
    expect(conventionTest('$varname')).toEqual(false);
    expect(conventionTest('$varname = "Font-name"')).toEqual(false);
  });

  it('false if correct naming convention: BEM', () => {
    app.state.conf = 'BEM';

    expect(conventionTest('$var-name__like-this =')).toEqual(false);
    expect(conventionTest('.class-name__like-this')).toEqual(false);
    expect(conventionTest('#id-name__like-this')).toEqual(false);
    expect(conventionTest('.block-{$var__name}')).toEqual(false);
    expect(conventionTest('#{$var__name}')).toEqual(false);
    expect(conventionTest(':{$var__name}')).toEqual(false);
    expect(conventionTest('#block__{$var-name}')).toEqual(false);
    expect(conventionTest('#block{$var-name}')).toEqual(false);
    expect(conventionTest('$varname')).toEqual(false);
    expect(conventionTest('$varname = "Font Name"')).toEqual(false);
  });

  it('true if NOT correct naming convention: lowercase-dash', () => {
    app.state.conf = 'lowercase-dash';

    expect(conventionTest('$var_name_like_this =')).toBeDefined();
    expect(conventionTest('.class_name_like_this')).toBeDefined();
    expect(conventionTest('#id_name_like_this')).toBeDefined();
    expect(conventionTest('.block_{$var-name}')).toBeDefined();
    expect(conventionTest('#{$var_name}')).toBeDefined();
    expect(conventionTest('#block_{$var_name}')).toBeDefined();
    expect(conventionTest(':{$var_name}')).toBeDefined();
    expect(conventionTest('.block_{$var-name}')).toBeDefined();
  });

  it('true if NOT correct naming convention: lowercase_underscore', () => {
    app.state.conf = 'lowercase_underscore';

    expect(conventionTest('$const-name-like-this =')).toBeDefined();
    expect(conventionTest('.class-name-like-this')).toBeDefined();
    expect(conventionTest('#id-name-like-this')).toBeDefined();
    expect(conventionTest('.block-{$const-name}')).toBeDefined();
    expect(conventionTest('#{$const-name}')).toBeDefined();
    expect(conventionTest('#block-{$const-name}')).toBeDefined();
    expect(conventionTest(':{$const-name}')).toBeDefined();
    expect(conventionTest('.block-{$constName}')).toBeDefined();
    expect(conventionTest('#{$constName}')).toBeDefined();
    expect(conventionTest('#block-{$constName}')).toBeDefined();
    expect(conventionTest(':{$constName}')).toBeDefined();
    expect(conventionTest('.block_{$const-name}')).toBeDefined();
  });

  it('true if NOT correct naming convention: camelCase', () => {
    app.state.conf = 'camelCase';

    expect(conventionTest('$const-name-like-this =')).toBeDefined();
    expect(conventionTest('.class-name-like-this')).toBeDefined();
    expect(conventionTest('#id-name-like-this')).toBeDefined();
    expect(conventionTest('$const_name_like_this =')).toBeDefined();
    expect(conventionTest('.class_name_like_this')).toBeDefined();
    expect(conventionTest('#id_name_like_this')).toBeDefined();
    expect(conventionTest('.block{$const-name}')).toBeDefined();
    expect(conventionTest('#{$const-name}')).toBeDefined();
    expect(conventionTest('#block{$const-name}')).toBeDefined();
    expect(conventionTest(':{$const-name}')).toBeDefined();
    expect(conventionTest('.block{$const_name}')).toBeDefined();
    expect(conventionTest('.block{$const-name}')).toBeDefined();
    expect(conventionTest('#{$const_name}')).toBeDefined();
    expect(conventionTest(':{$const_name}')).toBeDefined();
    expect(conventionTest('.block_{$const-name}')).toBeDefined();
  });

  it('true if not correct naming convention: BEM', () => {
    app.state.conf = 'BEM';

    expect(conventionTest('.classNameLikeThis')).toBeDefined();
    expect(conventionTest('#id_name_like_this')).toBeDefined();
    expect(conventionTest('.block_{$constName}')).toBeDefined();
    expect(conventionTest('#{$constName}')).toBeDefined();
    expect(conventionTest('#block_{$const-name}')).toBeDefined();
    expect(conventionTest('.block_{$const-name}')).toBeDefined();
  });

  describe('strict turned off', () => {
    beforeAll(() => {
      app.config.namingConventionStrict = false;
    });

    it('false if using classes or ids', () => {
      expect(conventionTest('.class_name_like_this')).toEqual(false);
      expect(conventionTest('#id_name_like_this')).toEqual(false);
      expect(conventionTest('.class-name-like-this')).toEqual(false);
      expect(conventionTest('#id-name-like-this')).toEqual(false);
      expect(conventionTest('.class-name-like-this')).toEqual(false);
      expect(conventionTest('#id-name-like-this')).toEqual(false);
    });

    it('false if custom convention matches', () => {
      app.state.conf = '[$]varExample';
      expect(conventionTest('$varExample')).toEqual(false);
    });

    it("true if custom convention doesn't match", () => {
      app.state.conf = 'something';
      expect(conventionTest('$var_name_like_this')).toEqual(true);
    });
  });
});
