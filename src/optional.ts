import {Callback, Consumer, Function, Predicate, Producer} from './function-types';
import {isNotNullOrUndefined, isNullOrUndefined, requireNonNull} from './object-utils';

/**
 * A container object which may or may not contain a non-null value.
 * If a value is present, {@code isPresent()} will return {@code true} and
 * {@code get()} will return the value.
 *
 * <p>Additional methods that depend on the presence or absence of a contained
 * value are provided, such as {@link orElse}
 * (return a default value if value not present) and
 * {@link ifPresent} (execute a block of code if the value is present).
 *
 * <p>This is a <a href="../lang/doc-files/ValueBased.html">value-based</a>
 * class; use of identity-sensitive operations (including reference equality
 * ({@code ==}), identity hash code, or synchronization) on instances of
 * {@code Optional} may have unpredictable results and should be avoided.
 *
 */
export class Optional<T> {
  /**
   * Common instance for {@code empty()}.
   */
  private static readonly EMPTY: Optional<any> = new Optional<any>();

  /**
   * If non-null, the value; if null, indicates no value is present
   */
  private readonly value: T | null | undefined;

  /**
   * Returns an empty {@code Optional} instance.  No value is present for this
   * Optional.
   *
   * @apiNote Though it may be tempting to do so, avoid testing if an object
   * is empty by comparing with {@code ==} against instances returned by
   * {@code Option.empty()}. There is no guarantee that it is a singleton.
   * Instead, use {@link #isPresent()}.
   *
   * @template <T> Type of the non-existent value
   * @return an empty {@code Optional}
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
   * Returns an {@code Optional} with the specified present non-null value.
   *
   * @template <T> the class of the value
   * @param value the value to be present, which must be non-null
   * @return an {@code Optional} with the value present
   * @throws Error if value is null
   */
  public static of<T>(value: T): Optional<T> {
    return new Optional<T>(requireNonNull(value));
  }

  /**
   * Returns an {@code Optional} describing the specified value, if non-null,
   * otherwise returns an empty {@code Optional}.
   *
   * @template <T> the class of the value
   * @param value the possibly-null value to describe
   * @return an {@code Optional} with a present value if the specified value
   * is non-null, otherwise an empty {@code Optional}
   */
  public static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return isNullOrUndefined(value) ? Optional.empty() : Optional.of(value as T);
  }

  private get nonNullValue(): T {
    return this.value as T;
  }

  /**
   * If a value is present in this {@code Optional}, returns the value,
   * otherwise throws {@code NoSuchElementException}.
   *
   * @return the non-null value held by this {@code Optional}
   * @throws NoSuchElementException if there is no value present
   *
   * @see Optional#isPresent()
   */
  public get(): T {
    if (isNullOrUndefined(this.value)) {
      throw new Error('No value present');
    }
    return this.value as T;
  }

  public isPresent(): boolean {
    //TODO: Implement via !empty
    return isNotNullOrUndefined(this.value);
  }

  /**
   * If a value is  not present, returns {@code true}, otherwise
   * {@code false}.
   *
   * @return value {@code true} if a value is not present, otherwise {@code false}
   */
  public isEmpty(): boolean {
    return isNullOrUndefined(this.value);
  }

  /**
   * If a value is present, invoke the specified consumer with the value,
   * otherwise do nothing.
   *
   * @param consumer block to be executed if a value is present
   * @throws NullPointerException if value is present and {@code consumer} is
   * null
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
   * @throws NullPointerException if a value is present and the given action
   *         is {@code null}, or no value is present and the given empty-based
   *         action is {@code null}.
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
   * return an {@code Optional} describing the value, otherwise return an
   * empty {@code Optional}.
   *
   * @param predicate a predicate to apply to the value, if present
   * @return an {@code Optional} describing the value of this {@code Optional}
   * if a value is present and the value matches the given predicate,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the predicate is null
   */
  public filter(predicate: Predicate<T>): Optional<T> {
    requireNonNull(predicate);
    if (!this.isPresent()) { //TODO:
      return this;
    } else {
      return predicate(this.nonNullValue) ? this : Optional.empty();
    }
  }

  /**
   * If a value is present, apply the provided mapping function to it,
   * and if the result is non-null, return an {@code Optional} describing the
   * result.  Otherwise return an empty {@code Optional}.
   *
   * @apiNote This method supports post-processing on optional values, without
   * the need to explicitly check for a return status.  For example, the
   * following code traverses a stream of file names, selects one that has
   * not yet been processed, and then opens that file, returning an
   * {@code Optional<FileInputStream>}:
   *
   * <pre>{@code
   *     Optional<FileInputStream> fis =
   *         names.stream().filter(name -> !isProcessedYet(name))
   *                       .findFirst()
   *                       .map(name -> new FileInputStream(name));
   * }</pre>
   *
   * Here, {@code findFirst} returns an {@code Optional<String>}, and then
   * {@code map} returns an {@code Optional<FileInputStream>} for the desired
   * file if one exists.
   *
   * @template <U> The type of the result of the mapping function
   * @param mapper a mapping function to apply to the value, if present
   * @return an {@code Optional} describing the result of applying a mapping
   * function to the value of this {@code Optional}, if a value is present,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the mapping function is null
   */
  public map<U>(mapper: Function<T, U>): Optional<U> {
    requireNonNull(mapper);
    if (!this.isPresent()) { //TODO: Use is empty
      return Optional.empty();
    } else {
      return Optional.ofNullable(mapper(this.nonNullValue));
    }
  }

  /**
   * If a value is present, apply the provided {@code Optional}-bearing
   * mapping function to it, return that result, otherwise return an empty
   * {@code Optional}.  This method is similar to {@link #map(Function)},
   * but the provided mapper is one whose result is already an {@code Optional},
   * and if invoked, {@code flatMap} does not wrap it with an additional
   * {@code Optional}.
   *
   * @template <U> The type parameter to the {@code Optional} returned by
   * @param mapper a mapping function to apply to the value, if present
   *           the mapping function
   * @return the result of applying an {@code Optional}-bearing mapping
   * function to the value of this {@code Optional}, if a value is present,
   * otherwise an empty {@code Optional}
   * @throws NullPointerException if the mapping function is null or returns
   * a null result
   */
  public flatMap<U>(mapper: Function<T, Optional<U>>): Optional<U> {
    requireNonNull(mapper);
    if (!this.isPresent()) {
      return Optional.empty();
    } else {
      return requireNonNull(mapper(this.nonNullValue));
    }
  }

  /**
   * Return the value if present, otherwise return {@code other}.
   *
   * @param other the value to be returned if there is no value present, may
   * be null
   * @return the value, if present, otherwise {@code other}
   */
  public orElse(other: T): T {
    return !isNullOrUndefined(this.value) ? this.nonNullValue : other;
  }

  /**
   * Return the value if present, otherwise invoke {@code other} and return
   * the result of that invocation.
   *
   * @param other a {@code Supplier} whose result is returned if no value
   * is present
   * @return the value if present otherwise the result of {@code other.get()}
   * @throws NullPointerException if value is not present and {@code other} is
   * null
   */
  public orElseGet<U>(other: Producer<U>): T | U {
    return !isNullOrUndefined(this.value) ? this.nonNullValue : other();
  }

  /**
   * Return the contained value, if present, otherwise throw an exception
   * to be created by the provided supplier.
   *
   * @apiNote A method reference to the exception constructor with an empty
   * argument list can be used as the supplier. For example,
   * {@code IllegalStateException::new}
   *
   * @param exceptionSupplier The supplier which will return the exception to
   * be thrown
   * @return the present value
   * @throws X if there is no value present
   * @throws NullPointerException if no value is present and
   * {@code exceptionSupplier} is null
   */
  public orElseThrow(exceptionSupplier: Producer<Error>): T {
    if (!isNullOrUndefined(this.value)) {
      return this.nonNullValue;
    } else {
      throw exceptionSupplier();
    }
  }

  public equals(obj: Optional<T>): boolean {
    if (this === obj) {
      return true;
    }

    return this.value === obj.value
  }
}
