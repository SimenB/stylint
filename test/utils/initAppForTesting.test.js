'use strict';

const initAppForTesting = require('../../src/utils/initAppForTesting');

describe('initAppForTesting', () => {
  beforeEach(() => {
    this.mockApp = initAppForTesting();
  });

  it('should return an instance of the stylint app', () => {
    expect(this.mockApp).not.toBeNull();
  });

  it('should disable logging for the app instance', () => {
    expect(this.mockApp.state.quiet).toBe(true);
  });

  it('should turn on strict mode for the app instance', () => {
    expect(this.mockApp.state.watching).toBe(true);
  });
});
