'use strict';

const bannedFunctions = require('../../src/checks/bannedFunctions');

describe('bannedFunctions: ban use of specific key words', () => {
  let context;

  beforeEach(() => {
    context = {
      report: jest.fn(),
    };
  });

  it("don't report if a line doesn't have any banned functions", () => {
    bannedFunctions(Object.assign(context, { line: '.foo' }));
    expect(context.report).not.toHaveBeenCalled();
  });

  it("don't report if a line has banned functions but is not found", () => {
    bannedFunctions(Object.assign(context, { line: '.foo', config: ['translate3d'] }));
    expect(context.report).not.toHaveBeenCalled();
  });

  it('report if line has a banned function', () => {
    bannedFunctions(Object.assign(context, { line: 'translate3d(1px, 1px, 0px)', config: ['translate3d'] }));
    expect(context.report.mock.calls).toMatchSnapshot();
  });
});
