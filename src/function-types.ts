/**
 * Consumes value and returns nothing
 */
export type Consumer<I> = (arg: I) => void;

export type Producer<I> = () => I;

/**
 * Gets no arguments and returns nothing
 */
export type Callback = () => void;

export type Predicate<T> = (arg: T) => boolean;

export type Function<T, R> = (arg: T) => R;

// tslint:disable-next-line:no-empty
export const nopCallback: Callback = () => {
};
