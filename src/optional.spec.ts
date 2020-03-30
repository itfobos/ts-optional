import { Optional } from './optional';
import { nopCallback } from './function-types';

describe('Optional', () => {
  const srcValue = 123;

  it(`get() from empty optional throw a error`, () => {
    expect(() => Optional.ofNullable(null).get()).toThrow();
  });

  it(`get() returns value from non empty optional`, () => {
    expect(() => Optional.ofNullable({}).get()).toBeTruthy();
  });

  it(`isEmpty works fine`, () => {
    expect(Optional.ofNullable(null).isEmpty).toBeTruthy();
  });

  it(`ifPresent passes value to consumer`, () => {
    Optional.of(srcValue).ifPresent(value => expect(value).toBe(srcValue));
  });

  it(`ifPresentOrElse passes value to consumer`, () => {
    Optional.of(srcValue).ifPresentOrElse(value => expect(value).toBe(srcValue), nopCallback);
  });

  it(`ifPresentOrElse calls empty action`, () => {
    const emptyActionSpy = jasmine.createSpy('emptyAction');
    Optional.ofNullable(null).ifPresentOrElse(nopCallback, emptyActionSpy);
    expect(emptyActionSpy).toHaveBeenCalled();
  });

  it(`orElseGet calls producer`, () => {
    const producer = () => 132;
    expect(Optional.ofNullable<number>(null).orElseGet(producer)).toBe(producer());
  });

  it(`An optional equals to itself`, () => {
    const numberOptional = Optional.of(srcValue);
    expect(numberOptional.equals(numberOptional)).toBeTruthy();
  });

  it(`optionals are equal in sense of value`, () => {
    const numberOptional = Optional.of(srcValue);
    const anotherNumberOptional = Optional.of(srcValue);
    expect(numberOptional.equals(anotherNumberOptional)).toBeTruthy();
  });

  it(`flatMap applies a mapper`, () => {
    const numberOptional = Optional.of(srcValue);
    const mapper = (value: number) => Optional.of(`${value}`);

    expect(numberOptional.flatMap(mapper).equals(mapper(srcValue))).toBeTruthy();
  });
});
