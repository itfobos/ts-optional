import { isNotNullOrUndefined, requireNonEmpty, requireNonNull } from '../src/object-utils';

describe('string-utils', () => {

  it(`requireNonNull() should return 'true' for non-empty string`, () => {
    const example = 'Just a string';
    expect(requireNonNull(example)).toEqual(example);
  });

  it(`requireNonNull() should throw the error message for null`, () => {
    const example = null;
    const errorMessage = 'Test Error';
    function functionForTest() {
      requireNonNull(example, errorMessage);
    }
    expect(functionForTest).toThrow(new Error(errorMessage));
  });

  it(`requireNonEmpty() should return a string`, () => {
    const example = 'Just a string';
    const errorMessage = 'Test Error';
    expect(requireNonEmpty(example, errorMessage)).toEqual(example);
  });

  it(`requireNonEmpty() should throw the error message for an empty string`, () => {
    const example = '';
    const errorMessage = 'Test Error';
    function functionForTest() {
      requireNonEmpty(example, errorMessage);
    }
    expect(functionForTest).toThrow(new Error(errorMessage));
  });

  it(`isNotNullOrUndefined() should return 'false' for undefined`, () => {
    const example = undefined;
    expect(isNotNullOrUndefined(example)).toEqual(false);
  });

  it(`isNotNullOrUndefined() should return 'true' for a string`, () => {
    const example = 'Just a string';
    expect(isNotNullOrUndefined(example)).toEqual(true);
  });
});
