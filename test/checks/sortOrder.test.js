'use strict';

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
    jest.spyOn(app, 'msg');
  });

  afterEach(() => {
    app.cache.messages = [];
    app.cache.sortOrderCache = [];
  });

  it('undefined if root level', () => {
    app.state.context = 0;
    expect(sortTest('margin 0')).toBeUndefined();
  });

  it('cache length should only be 1 (the current prop) if context switched', () => {
    app.cache.sortOrderCache = ['border', 'margin', 'padding'];
    app.state.prevContext = 0;
    app.state.context = 1;

    expect(app.cache.sortOrderCache).toHaveLength(3);
    sortTest('margin 0');
    expect(app.cache.sortOrderCache).toHaveLength(1);
  });

  describe('disabled', () => {
    beforeEach(() => {
      app.state.conf = false;
    });

    it('should allow any order when disabled', () => {
      const expectedCache = ['background', 'z-index', 'border', 'width'];

      expect(app.state.conf).toEqual(false);
      expect(sortTest('  background')).toBeDefined();
      expect(sortTest('  z-index')).toBeDefined();
      expect(sortTest('  border')).toBeDefined();
      expect(sortTest('  width')).toBeDefined();
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
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

      expect(app.state.conf).toEqual('alphabetical');
      expect(app.cache.sortOrderCache).toHaveLength(3);
      expect(sortTest('  position absolute')).toBeDefined();
      expect(sortTest('  z-index 1')).toBeDefined();
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
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

      expect(app.state.conf).toEqual('alphabetical');
      expect(app.cache.sortOrderCache).toHaveLength(3);
      expect(sortTest('  line-height 1')).toEqual(false);
      expect(sortTest('  background none')).toEqual(false);
      expect(sortTest('border 1px solid #fff')).toEqual(false);
      expect(sortTest('color: rgba( 0, 0, 0, 1 )')).toEqual(false);
      expect(app.cache.sortOrderCache).toEqual(expectedCache);

      expect(app.msg).toHaveBeenCalledWith('prefer alphabetical when sorting properties');
    });

    it('undefined if not checkable syntax', () => {
      expect(app.state.conf).toEqual('alphabetical');
      expect(app.cache.sortOrderCache).toHaveLength(3);
      expect(sortTest('mixin()')).toBeUndefined();
      expect(sortTest('$var-name')).toBeUndefined();
      expect(sortTest('.class-name')).toBeUndefined();
      expect(sortTest('#id')).toBeUndefined();
      expect(sortTest('{interpolated}')).toBeUndefined();
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
      expect(sortTest('margin 0')).toEqual(false);
    });

    it('false if not correct sort order with mocked sort order cache', () => {
      const expectedCache = ['position', 'right', 'top'];

      expect(app.state.conf).toEqual('grouped');
      expect(app.cache.sortOrderCache).toHaveLength(2);
      expect(sortTest('top 0')).toEqual(false);
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
    });

    it('true if correct sort order with mocked sort order cache', () => {
      const expectedCache = ['position', 'right', 'bottom', 'z-index', 'width'];

      expect(app.state.conf).toEqual('grouped');
      expect(app.cache.sortOrderCache).toHaveLength(2);
      expect(sortTest('bottom 0')).toBeDefined();
      expect(sortTest('z-index 1')).toBeDefined();
      expect(sortTest('width 50%')).toBeDefined();
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
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

      expect(app.state.conf).toEqual(['z-index', 'animation', 'top']);
      expect(app.cache.sortOrderCache).toHaveLength(1);
      expect(sortTest('top 50px')).toBeDefined();
      expect(sortTest('animation fade-out')).toEqual(false);
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
    });

    it('true if correct sort order with mocked sort order cache', () => {
      const expectedCache = ['z-index', 'animation', 'top', 'width', 'border'];

      expect(app.state.conf).toEqual(['z-index', 'animation', 'top']);
      expect(app.cache.sortOrderCache).toHaveLength(1);
      expect(sortTest('animation fade-in')).toBeDefined();
      expect(sortTest('top 0')).toBeDefined();
      expect(sortTest('width 50%')).toBeDefined();
      expect(sortTest('border 0')).toBeDefined();
      expect(app.cache.sortOrderCache).toEqual(expectedCache);
    });
  });
});
