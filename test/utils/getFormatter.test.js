'use strict';

const getFormatter = require('../../src/utils/getFormatter');

const FORMATTERS_MOCK_PATH = '../../src/formatters';

describe('getFormatter', () => {
  let returnValue;

  // Must be prefixed with `mock` to allow it to be returned in `jest.mock` calls.
  const mockDefaultFormatter = 'Awake';
  const mockPrettyFormatter = 'Shake dreams from your hair, my pretty child, my sweet one';
  const mockThirdPartyFormatter = 'Choose the day and choose the sign of your day';

  beforeAll(() => {
    jest.mock(`${FORMATTERS_MOCK_PATH}/default`, () => mockDefaultFormatter);
    jest.mock(`${FORMATTERS_MOCK_PATH}/pretty`, () => mockPrettyFormatter);
    jest.mock('thirdPartyFormatter', () => mockThirdPartyFormatter, { virtual: true });
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
      returnValue = getFormatter('pretty');
    });

    it('should return the formatter', () => {
      expect(returnValue).toBe(mockPrettyFormatter);
    });
  });

  describe('when a third party formatter module is passed in', () => {
    beforeEach(() => {
      returnValue = getFormatter({ name: 'thirdPartyFormatter', thirdParty: true });
    });

    it('should return the third party formatter', () => {
      expect(returnValue).toBe(mockThirdPartyFormatter);
    });
  });

  describe("when the formatter doesn't exist", () => {
    const missingFormatter = 'this/formatter/doesnt/exist';
    const includesMissingFormatterPath = new RegExp(`${missingFormatter}`);
    const getMissingFormatter = () => {
      getFormatter(missingFormatter);
    };

    it('should throw an error with the invalid formatter path in the message', () => {
      expect(getMissingFormatter).toThrow(includesMissingFormatterPath);
    });
  });

  describe('when the formatter is an object', () => {
    describe('and there is no name key', () => {
      const getFormatterWithNonStringValue = () => {
        getFormatter({ hmm: "This isn't where I parked my car." });
      };

      it('should throw a type error', () => {
        expect(getFormatterWithNonStringValue).toThrow(TypeError);
      });
    });

    describe('and there is a name key', () => {
      beforeEach(() => {
        returnValue = getFormatter({ name: 'pretty' });
      });

      it('should return the formatter according to that name key', () => {
        expect(returnValue).toBe(mockPrettyFormatter);
      });
    });
  });
});
