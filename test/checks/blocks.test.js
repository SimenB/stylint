'use strict';

const blockTest = require('../../src/checks/blocks');

describe('blocks', () => {
  describe('prefer @block when defining block vars', () => {
    let context;

    beforeEach(() => {
      context = {
        report: jest.fn(),
        conf: 'always',
      };
    });

    it('report if block style incorrect', () => {
      blockTest(Object.assign({}, context, { line: 'myBlock = ' }));
      blockTest(Object.assign({}, context, { line: 'myBlock =' }));

      expect(context.report.mock.calls).toMatchSnapshot();
    });

    it("don't report if block style correct", () => {
      blockTest(Object.assign({}, context, { line: 'myBlock = @block' }));
      blockTest(Object.assign({}, context, { line: 'myBlock = @block ' }));

      expect(context.report).not.toHaveBeenCalled();
    });

    it("don't report if block style not applicable", () => {
      blockTest(Object.assign({}, context, { line: '.class' }));
      blockTest(Object.assign({}, context, { line: 'input[type="submit"]' }));

      expect(context.report).not.toHaveBeenCalled();
    });
  });

  describe('disallow @block when defining block vars', () => {
    let context;

    beforeEach(() => {
      context = {
        report: jest.fn(),
        conf: 'never',
      };
    });

    it("don't report if block style IS correct", () => {
      blockTest(Object.assign({}, context, { line: 'myBlock = ' }));
      blockTest(Object.assign({}, context, { line: 'myBlock =' }));

      expect(context.report).not.toHaveBeenCalled();
    });

    it('report if block style NOT correct', () => {
      blockTest(Object.assign({}, context, { line: 'myBlock = @block' }));
      blockTest(Object.assign({}, context, { line: 'myBlock = @block ' }));

      expect(context.report.mock.calls).toMatchSnapshot();
    });

    it("don't report if block style not applicable", () => {
      blockTest(Object.assign({}, context, { line: '.class' }));
      blockTest(Object.assign({}, context, { line: 'input[type="submit"]' }));

      expect(context.report).not.toHaveBeenCalled();
    });
  });
});
