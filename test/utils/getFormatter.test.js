'use strict';

const getFormatter = require('../../src/utils/getFormatter');

const FORMATTERS_MOCK_PATH = '../../src/formatters';

describe('getFormatter', () => {
  let returnValue;

  // Must be prefixed with `mock` to allow it to be returned in `jest.mock` calls.
  const nativeFormatter = `${FORMATTERS_MOCK_PATH}/pretty`;
  const fileFormatterPath = 'fileFormatter';
  const thirdPartyFormatterPath = 'thirdPartyFormatter';
  const mockPrettyFormatter = 'Awake';
  const mockThirdPartyFormatter =
    'Shake dreams from your hair, my pretty child, my sweet one';
  const mockFileFormatter = 'Choose the day and choose the sign of your day';

  beforeAll(() => {
    jest.mock(nativeFormatter, () => mockPrettyFormatter);
    jest.mock(thirdPartyFormatterPath, () => mockThirdPartyFormatter, {
      virtual: true,
    });
    jest.mock(fileFormatterPath, () => mockFileFormatter, { virtual: true });
  });

  describe('when the formatter is a native formatter', () => {
    beforeEach(() => {
      returnValue = getFormatter('pretty');
    });

    it('should return the formatter', () => {
      expect(returnValue).toBe(mockPrettyFormatter);
    });
  });

  describe('when the formatter is a third party formatter', () => {
    beforeEach(() => {
      returnValue = getFormatter(thirdPartyFormatterPath);
    });

    it('should return the third party formatter', () => {
      expect(returnValue).toBe(mockThirdPartyFormatter);
    });
  });

  describe('when the formatter is a file', () => {
    beforeEach(() => {
      returnValue = getFormatter(fileFormatterPath);
    });

    it('should return the file formatter', () => {
      expect(returnValue).toBe(mockFileFormatter);
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
});
