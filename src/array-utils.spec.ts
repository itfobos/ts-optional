import { isNotNullOrEmptyArray } from './array-utils';

describe('array-utils', () => {

  it(`isNotNullOrEmptyArray() should return 'true' for non-empty array`, () => {
    expect(isNotNullOrEmptyArray([{}, {}])).toBeTruthy();
  });

  it(`isNotNullOrEmptyArray() should return 'false' for empty array`, () => {
    expect(isNotNullOrEmptyArray([])).toBeFalsy();
  });

  it(`isNotNullOrEmptyArray() should return 'false' for null array`, () => {
    expect(isNotNullOrEmptyArray(undefined)).toBeFalsy();
  });
});
