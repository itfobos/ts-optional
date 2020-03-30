import { isNotNullOrEmpty } from './string-utils';

describe('string-utils', () => {

  it(`isNotNullOrEmpty() should return 'true' for non-empty string`, () => {
    const example = 'Just a string';
    expect(isNotNullOrEmpty(example)).toEqual(true);
  });

  it(`isNotNullOrEmpty() should return 'false' for empty string`, () => {
    const example = '';
    expect(isNotNullOrEmpty(example)).toEqual(false);
  });

  it(`isNotNullOrEmpty() should return 'false' for null string`, () => {
    const example = undefined;
    expect(isNotNullOrEmpty(example)).toEqual(false);
  });
});
