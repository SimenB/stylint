'use strict';

const assert = require('assert');
const stylint = require('../../index');

const app = stylint().create();

// turn on strict mode from this point and turn off unnecessary logging
app.state.strictMode = true;
app.state.quiet = true;
app.state.watching = true;

const sortTest = app.lintMethods.sortOrder.bind(app);

describe('sort order', () => {
  beforeEach(() => {
    app.state.prevContext = 1;
    app.state.context = 1;
  });

  afterEach(() => {
    app.cache.messages = [];
    app.cache.sortOrderCache = [];
  });

  it('undefined if root level', () => {
    app.state.context = 0;
    assert.equal(undefined, sortTest('margin 0'));
  });

  it('cache length should only be 1 (the current prop) if context switched', () => {
    app.cache.sortOrderCache = ['border', 'margin', 'padding'];
    app.state.prevContext = 0;
    app.state.context = 1;

    assert.equal(3, app.cache.sortOrderCache.length);
    sortTest('margin 0');
    assert.equal(1, app.cache.sortOrderCache.length);
  });

  describe('disabled', () => {
    beforeEach(() => {
      app.state.conf = false;
    });

    it('should allow any order when disabled', () => {
      const expectedCache = ['background', 'z-index', 'border', 'width'];

      assert.equal(false, app.state.conf);
      assert.ok(sortTest('  background'));
      assert.ok(sortTest('  z-index'));
      assert.ok(sortTest('  border'));
      assert.ok(sortTest('  width'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });
  });

  describe('alphabetical', () => {
    beforeEach(() => {
      app.state.conf = 'alphabetical';
      app.cache.sortOrderCache = ['border', 'margin', 'padding'];
    });

    afterEach(() => {
      app.cache.sortOrderCache = [];
    });

    it('true if correct sort order with mocked sort order cache', () => {
      const expectedCache = ['border', 'margin', 'padding', 'position', 'z-index'];

      assert.equal('alphabetical', app.state.conf);
      assert.equal(3, app.cache.sortOrderCache.length);
      assert.ok(sortTest('  position absolute'));
      assert.ok(sortTest('  z-index 1'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });

    it('false if not correct sort order with mocked sort order cache', () => {
      const expectedCache = [
        'border',
        'margin',
        'padding',
        'line-height',
        'background',
        'border',
        'color',
      ];

      assert.equal('alphabetical', app.state.conf);
      assert.equal(3, app.cache.sortOrderCache.length);
      assert.equal(false, sortTest('  line-height 1'));
      assert.equal(false, sortTest('  background none'));
      assert.equal(false, sortTest('border 1px solid #fff'));
      assert.equal(false, sortTest('color: rgba( 0, 0, 0, 1 )'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });

    it('undefined if not checkable syntax', () => {
      assert.equal('alphabetical', app.state.conf);
      assert.equal(3, app.cache.sortOrderCache.length);
      assert.equal(undefined, sortTest('mixin()'));
      assert.equal(undefined, sortTest('$var-name'));
      assert.equal(undefined, sortTest('.class-name'));
      assert.equal(undefined, sortTest('#id'));
      assert.equal(undefined, sortTest('{interpolated}'));
    });
  });

  describe('grouped', () => {
    beforeEach(() => {
      app.state.conf = 'grouped';
      app.cache.sortOrderCache = ['position', 'right'];
    });

    afterEach(() => {
      app.cache.sortOrderCache = [];
    });

    it('false if sorted array is shorter than cache', () => {
      app.cache.sortOrderCache = ['border', 'margin', 'padding'];
      assert.equal(false, sortTest('margin 0'));
    });

    it('false if not correct sort order with mocked sort order cache', () => {
      const expectedCache = ['position', 'right', 'top'];

      assert.equal('grouped', app.state.conf);
      assert.equal(2, app.cache.sortOrderCache.length);
      assert.equal(false, sortTest('top 0'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });

    it('true if correct sort order with mocked sort order cache', () => {
      const expectedCache = ['position', 'right', 'bottom', 'z-index', 'width'];

      assert.equal('grouped', app.state.conf);
      assert.equal(2, app.cache.sortOrderCache.length);
      assert.ok(sortTest('bottom 0'));
      assert.ok(sortTest('z-index 1'));
      assert.ok(sortTest('width 50%'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });
  });

  describe('Array', () => {
    beforeEach(() => {
      app.state.conf = ['z-index', 'animation', 'top'];
      app.cache.sortOrderCache = ['z-index'];
    });

    afterEach(() => {
      app.cache.sortOrderCache = [];
    });

    it('false if not correct sort order with mocked sort order cache', () => {
      const expectedCache = ['z-index', 'top', 'animation'];

      assert.deepEqual(['z-index', 'animation', 'top'], app.state.conf);
      assert.equal(1, app.cache.sortOrderCache.length);
      assert.ok(sortTest('top 50px'));
      assert.equal(false, sortTest('animation fade-out'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });

    it('true if correct sort order with mocked sort order cache', () => {
      const expectedCache = ['z-index', 'animation', 'top', 'width', 'border'];

      assert.deepEqual(['z-index', 'animation', 'top'], app.state.conf);
      assert.equal(1, app.cache.sortOrderCache.length);
      assert.ok(sortTest('animation fade-in'));
      assert.ok(sortTest('top 0'));
      assert.ok(sortTest('width 50%'));
      assert.ok(sortTest('border 0'));
      assert.equal(expectedCache.length, app.cache.sortOrderCache.length);
      assert.deepEqual(expectedCache, app.cache.sortOrderCache);
    });
  });
});
