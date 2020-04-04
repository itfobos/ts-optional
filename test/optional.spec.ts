import {Optional} from '../src/optional';
import {nopCallback} from '../src/function-types';

describe('Optional', () => {
  const srcValue = 123;

  it(`get() from empty optional throw a error`, () => {
    expect(() => Optional.ofNullable(null).get()).toThrow();
  });

  it(`get() returns value from non empty optional`, () => {
    expect(Optional.ofNullable({}).get()).toBeTruthy();
  });

  it(`isEmpty works fine`, () => {
    expect(Optional.ofNullable(null).isEmpty()).toBeTruthy();
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

  it(`flatMap returns empty optional for empty source`, () => {
    const srcOptional = Optional.empty();
    const mapper = () => Optional.of('some str');

    expect(srcOptional.flatMap(mapper).isEmpty()).toBeTruthy();
  });

  it(`For non empty source, filter returns non empty optional, if predicate matches`, () => {
    const srcOptional = Optional.of({});

    expect(srcOptional.filter(() => true).isPresent()).toBeTruthy();
  });

  it(`For non empty source, filter returns empty optional, if predicate doesn't match`, () => {
    const srcOptional = Optional.of({});

    expect(srcOptional.filter(() => false).isEmpty()).toBeTruthy();
  });

  it(`For empty source, filter returns empty optional all the time`, () => {
    const srcOptional = Optional.empty();

    expect(srcOptional.filter(() => false).isEmpty()).toBeTruthy();
    expect(srcOptional.filter(() => true).isEmpty()).toBeTruthy();
  });

  it(`map works correctly for success path`, () => {
    const srcOptional = Optional.of({});
    const mapperResult = 1;

    const mappedOptional = srcOptional.map(() => mapperResult);

    expect(mappedOptional.isPresent()).toBeTruthy();
    expect(mappedOptional.get()).toBe(mapperResult);
  });

  it(`map throws a error for nullable mapper`, () => {
    const srcOptional = Optional.empty();

    expect(() => srcOptional.map(null as any)).toThrow();
  });

  it(`map doesn't call mapper function for empty optional`, () => {
    const srcOptional = Optional.empty();
    const mapperFuncSpy = jasmine.createSpy('mapperFunc');

    expect(srcOptional.map(mapperFuncSpy).isEmpty()).toBeTruthy();
    expect(mapperFuncSpy).not.toHaveBeenCalled();
  });

  it(`orElse returns src value for nonempty optional`, () => {
    const srcValue = 'some src value';

    expect(Optional.of(srcValue).orElse('other value')).toBe(srcValue);
  });

  it(`orElse returns other value for empty optional`, () => {
    const otherValue = 'some src value';

    expect(Optional.empty().orElse(otherValue)).toBe(otherValue);
  });

  it(`orElseThrow returns src value for nonempty optional`, () => {
    const srcValue = 'some src value';

    expect(Optional.of(srcValue).orElseThrow(() => new Error())).toBe(srcValue);
  });

  it(`orElseThrow throws a error for empty optional`, () => {
    expect(() => Optional.empty().orElseThrow(() => new Error())).toThrow();
  });
});
