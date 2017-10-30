'use strict';

const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const quoteTest = app.lintMethods.quotePref.bind(app);

describe('quote style', () => {
  beforeEach(() => {
    app.state.severity = 'warning';
  });

  afterEach(() => {
    app.cache.messages = [];
  });

  it('false if correct quote style used: single', () => {
    app.state.conf = 'single';
    expect(quoteTest('', "$var = 'test string' ")).toEqual(false);
    expect(quoteTest('', '$var = \'test "substring" string\' ')).toEqual(false);
    expect(quoteTest('', ".show-content( $content = 'Hello!' )")).toEqual(
      false
    );
    expect(quoteTest('', ".show-content( $content = 'Hello!' ) {")).toEqual(
      false
    );
    expect(
      quoteTest(
        '',
        ".join-strings( $content1 = 'Hello!', $content2 = 'World!' )"
      )
    ).toEqual(false);
    expect(quoteTest('', "[class*='--button']")).toEqual(false);
    expect(quoteTest('', "[class*='--button'] {")).toEqual(false);
    expect(quoteTest('', "show-content( $content = 'Hello!' ) {")).toEqual(
      false
    );
  });

  it('false if correct quote style used: double', () => {
    app.state.conf = 'double';
    expect(quoteTest('', '$var = \'test "substring" string\' ')).toEqual(false);
    expect(quoteTest('', "$var = 'test \"substring string' ")).toEqual(false);
    expect(quoteTest('', '$var = "test \'substring\' string"')).toEqual(false);
    expect(quoteTest('', '$var = "test let\'s string"')).toEqual(false);
    expect(quoteTest('', '$var = "test string" ')).toEqual(false);
    expect(quoteTest('', '$var = "test \'substring\' string"')).toEqual(false);
    expect(quoteTest('', '$var = "test let\'s string"')).toEqual(false);
    expect(quoteTest('', '.show-content( $content = "Hello!" )')).toEqual(
      false
    );
    expect(quoteTest('', '.show-content( $content = "Hello!" ) {')).toEqual(
      false
    );
    expect(
      quoteTest(
        '',
        '.join-strings( $content1 = "Hello!", $content2 = "World!" )'
      )
    ).toEqual(false);
    expect(quoteTest('', '[class*="--button"]')).toEqual(false);
    expect(quoteTest('', '[class*="--button"] {')).toEqual(false);
    expect(quoteTest('', 'show-content( $content = "Hello!" ) {')).toEqual(
      false
    );
  });

  it('true if incorrect quote style used: single', () => {
    app.state.conf = 'single';
    expect(quoteTest('', '$var = "test string" ')).toBeDefined();
    expect(quoteTest('', '.show-content( $content = "Hello!" )')).toBeDefined();
    expect(
      quoteTest(
        '',
        '.join-strings( $content1 = "Hello!", $content2 = \'World!\' )'
      )
    ).toBeDefined();
    expect(
      quoteTest('', '.show-content( $content = "Hello!" ) {')
    ).toBeDefined();
    expect(quoteTest('', '[class*="--button"]')).toBeDefined();
  });

  it('true if incorrect quote style used: double', () => {
    app.state.conf = 'double';
    expect(quoteTest('', "$var = 'test string' ")).toBeDefined();
    expect(quoteTest('', ".show-content( $content = 'Hello!' )")).toBeDefined();
    expect(
      quoteTest('', ".show-content( $content = 'Hello!' ) {")
    ).toBeDefined();
    expect(
      quoteTest(
        '',
        '.join-strings( $content1 = "Hello!", $content2 = \'World!\' )'
      )
    ).toBeDefined();
    expect(quoteTest('', "[class*='--button']")).toBeDefined();
  });

  it('undefined if no quotes on line', () => {
    expect(quoteTest('', '$var = #000 ')).toBeUndefined();
  });
});
