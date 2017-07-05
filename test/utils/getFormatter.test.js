'use strict';

const sinon = require('sinon');
const getFormatter = require('../../src/utils/getFormatter');
const FORMATTERS_MOCK_PATH = '../../src/formatters';

describe('getFormatter', () => {
  let returnValue;

  // Must be prefixed with `mock` to allow it to be returned in `jest.mock` calls.
  const mockDefaultFormatter = 'defaultFormatter';
  const mockJsonFormatter = 'jsonFormatter';
  const mockThirdPartyFormatter = 'thirdPartyFormatter';

  beforeAll(() => {
    jest.mock(`${FORMATTERS_MOCK_PATH}/default`, () => {
      return mockDefaultFormatter;
    });
    jest.mock(`${FORMATTERS_MOCK_PATH}/json`, () => {
      return mockJsonFormatter;
    }, {virtual: true});
    jest.mock('mockNodeDependency', () => {
      return mockThirdPartyFormatter;
    }, {virtual: true});
  });

  describe('when no value is passed in', () => {
    beforeEach(() => {
      returnValue = getFormatter();
    });

    it('should return the default formatter', () => {
      expect(returnValue).toBe(mockDefaultFormatter);
    });
  });

  describe('when a native formatter is passed in', () => {
    beforeEach(() => {
      returnValue = getFormatter('json');
    });

    it('should return the formatter', () => {
      expect(returnValue).toBe(mockJsonFormatter);
    });
  });

  describe('when a third party formatter module is passed in', () => {
    beforeEach(() => {
      returnValue = getFormatter('json');
    });

    it('should return the formatter', () => {
      expect(returnValue).toBe(mockJsonFormatter);
    });
  });

  describe("when the formatter doesn't exist", () => {
    const missingFormatter = 'this/formatter/doesnt/exist'
    const includesMissingFormatterPath = new RegExp(`${missingFormatter}`);
    const getMissingFormatter = () => {
      getFormatter(missingFormatter);
    };

    it('should throw a generic error', () => {
      expect(getMissingFormatter).toThrow(includesMissingFormatterPath);
    });
  });

  describe("when the formatter isn't a string", () => {
    const getFormatterWithNonStringValue = () => {
      getFormatter({question: 'Why on earth would you call this method with an object?'});
    };

    it('should throw the provided error', () => {
      expect(getFormatterWithNonStringValue).toThrow(TypeError)
    });
  });
});
