import {Callback, Consumer, Function, Predicate, Producer} from './function-types';
import {isNotNullOrUndefined, isNullOrUndefined, requireNonNull} from './object-utils';

/**
 * A container object which may or may not contain a non-null value.
 * If a value is present, {@linkcode isPresent} will return <code>true</code> and
 * {@linkcode get} will return the value.
 *
 * <p>Additional methods that depend on the presence or absence of a contained
 * value are provided, such as {@linkcode orElse}
 * (return a default value if value not present) and
 * {@linkcode ifPresent} (execute a block of code if the value is present).
 *
 * <p>This is a <a href="https://docs.oracle.com/javase/11/docs/api/java/lang/doc-files/ValueBased.html">value-based</a>
 * class.
 */
export class Optional<T> {
  /**
   * Common instance for {@linkcode empty}.
   */
  private static readonly EMPTY: Optional<any> = new Optional<any>();

  /**
   * If non-null, the value; if null, indicates no value is present
   */
  private readonly value: T | null | undefined;

  /**
   * Returns an empty {@linkcode Optional} instance.  No value is present for this
   * Optional.
   * <br/>
   * Though it may be tempting to do so, avoid testing if an object
   * is empty by comparing with <code>==</code> against instances returned by
   * {@linkcode empty}. There is no guarantee that it is a singleton.
   * Instead, use {@linkcode isPresent}.
   *
   * @template T Type of the non-existent value
   * @return an empty {@linkcode Optional}
   */
  public static empty<T>(): Optional<T> {
    return Optional.EMPTY as Optional<T>;
  }

  /**
   * Constructs an instance with the value present.
   *
   * Otherwise, constructs an empty instance.
   *
   * @param value to be present
   */
  private constructor(value?: T) {
    if (isNullOrUndefined(value)) {
      this.value = null;
    } else {
      this.value = value;
    }
  }

  /**
   * Returns an {@linkcode Optional} with the specified present non-null value.
   *
   * @template T the class of the value
   * @param value the value to be present, which must be non-null
   * @return an {@linkcode Optional} with the value present
   * @throws Error if value is null
   */
  public static of<T>(value: T): Optional<T> {
    return new Optional<T>(requireNonNull(value));
  }

  /**
   * Returns an {@linkcode Optional} describing the specified value, if non-null,
   * otherwise returns an empty {@linkcode Optional}.
   *
   * @template T the class of the value
   * @param value the possibly-null value to describe
   * @return an {@linkcode Optional} with a present value if the specified value
   * is non-null, otherwise an empty {@linkcode Optional}
   */
  public static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return isNullOrUndefined(value) ? Optional.empty() : Optional.of(value as T);
  }

  private get nonNullValue(): T {
    return this.value as T;
  }

  /**
   * If a value is present in this {@linkcode Optional}, returns the value,
   * otherwise throws {@linkcode Error}.
   *
   * @return the non-null value held by this {@linkcode Optional}
   * @throws {@linkcode Error} if there is no value present
   *
   * @see {@linkcode isPresent}
   */
  public get(): T {
    if (isNullOrUndefined(this.value)) {
      throw new Error('No value present');
    }
    return this.value as T;
  }

  public isPresent(): boolean {
    return !this.isEmpty();
  }

  /**
   * If a value is  not present, returns <code>true</code>, otherwise
   * <code>false</code>.
   *
   * @return value </code>true</code> if a value is not present, otherwise </code>false</code>
   */
  public isEmpty(): boolean {
    return isNullOrUndefined(this.value);
  }

  /**
   * If a value is present, invoke the specified consumer with the value,
   * otherwise do nothing.
   *
   * @param consumer block to be executed if a value is present
   * @throws Error if value is present and <code>consumer</code> is null
   */
  public ifPresent(consumer: Consumer<T>): void {
    if (isNotNullOrUndefined(this.value)) {
      consumer(this.nonNullValue);
    }
  }

  /**
   * If a value is present, performs the given action with the value,
   * otherwise performs the given empty-based action.
   *
   * @param action the action to be performed, if a value is present
   * @param emptyAction the empty-based action to be performed, if no value is
   *        present
   * @throws Error if a value is present and the given action
   *         is <code>null</code>, or no value is present and the given empty-based
   *         action is <code>null</code>.
   */
  public ifPresentOrElse(action: Consumer<T>, emptyAction: Callback): void {
    if (isNotNullOrUndefined(this.value)) {
      action(this.nonNullValue);
    } else {
      emptyAction();
    }
  }

  /**
   * If a value is present, and the value matches the given predicate,
   * return an {@linkcode Optional} describing the value, otherwise return an
   * empty {@linkcode Optional}.
   *
   * @param predicate a predicate to apply to the value, if present
   * @return an {@linkcode Optional} describing the value of this {@linkcode Optional}
   * if a value is present and the value matches the given predicate,
   * otherwise an empty {@linkcode Optional}
   * @throws Error if the predicate is <code>null</code>
   */
  public filter(predicate: Predicate<T>): Optional<T> {
    requireNonNull(predicate);
    if (this.isEmpty()) {
      return this;
    } else {
      return predicate(this.nonNullValue) ? this : Optional.empty();
    }
  }

  /**
   * If a value is present, apply the provided mapping function to it,
   * and if the result is non-null, return an {@linkcode Optional} describing the
   * result.  Otherwise return an empty {@linkcode Optional}.
   * <br/>
   * This method supports post-processing on optional values, without
   * the need to explicitly check for a return status.
   * <br/>
   * For example, the following code creates Optional around a response,
   * and then checks is the received request successful.
   *
   * <pre>
   *    const responseIsSuccessful = Optional.ofNullable(response)
   *                                         .map(resp => resp.isSuccessful)
   *                                         .orElse(false);
   * </pre>
   *
   * Here, `Optional.ofNullable(response)` returns an `Optional<any>`, and then
   * {@linkcode map} returns an `Optional<boolean>`.
   *
   * @template U The type of the result of the mapping function
   * @param mapper a mapping function to apply to the value, if present
   * @return an {@linkcode Optional} describing the result of applying a mapping
   * function to the value of this {@linkcode Optional}, if a value is present,
   * otherwise an empty {@linkcode Optional}
   * @throws Error if the mapping function is null
   */
  public map<U>(mapper: Function<T, U>): Optional<U> {
    requireNonNull(mapper);
    if (this.isEmpty()) {
      return Optional.empty();
    } else {
      return Optional.ofNullable(mapper(this.nonNullValue));
    }
  }

  /**
   * If a value is present, apply the provided {@linkcode Optional}-bearing
   * mapping function to it, return that result, otherwise return an empty
   * {@linkcode Optional}.  This method is similar to {@linkcode map},
   * but the provided mapper is one whose result is already an {@linkcode Optional},
   * and if invoked, {@linkcode flatMap} does not wrap it with an additional
   * {@linkcode Optional}.
   *
   * @template U The type parameter to the {@linkcode Optional} returned by
   * @param mapper a mapping function to apply to the value, if present
   *           the mapping function
   * @return the result of applying an {@linkcode Optional}-bearing mapping
   * function to the value of this {@linkcode Optional}, if a value is present,
   * otherwise an empty {@linkcode Optional}
   * @throws Error if the mapping function is null or returns a null result
   */
  public flatMap<U>(mapper: Function<T, Optional<U>>): Optional<U> {
    requireNonNull(mapper);
    if (this.isEmpty()) {
      return Optional.empty();
    } else {
      return requireNonNull(mapper(this.nonNullValue));
    }
  }

  /**
   * Return the value if present, otherwise return <code>other</code>.
   *
   * @param other the value to be returned if there is no value present, may
   * be null
   * @return the value, if present, otherwise <code>other</code>
   */
  public orElse(other: T): T {
    return !isNullOrUndefined(this.value) ? this.nonNullValue : other;
  }

  /**
   * Return the value if present, otherwise invoke <code>other</code> and return
   * the result of that invocation.
   *
   * @param other a {@linkcode Supplier} whose result is returned if no value
   * is present
   * @return the value if present otherwise the result of <code>other()</code>
   * @throws Error if value is not present and <code>other</code> is null
   */
  public orElseGet<U>(other: Producer<U>): T | U {
    return !isNullOrUndefined(this.value) ? this.nonNullValue : other();
  }

  /**
   * Return the contained value, if present, otherwise throw an error
   * to be created by the provided supplier.
   *
   * @param errorSupplier The supplier which will return the error to be thrown
   * @return the present value
   * @throws Error if there is no value present
   * @throws Error if no value is present and `errorSupplier` is null
   */
  public orElseThrow(errorSupplier: Producer<Error>): T {
    if (!isNullOrUndefined(this.value)) {
      return this.nonNullValue;
    } else {
      throw errorSupplier();
    }
  }

  public equals(obj: Optional<T>): boolean {
    if (this === obj) {
      return true;
    }

    return this.value === obj.value
  }
}
