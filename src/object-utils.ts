import {isNotNullOrEmpty, isNullOrEmpty} from './string-utils';

/**
 * Check a passed object against null/undefined.
 *
 * @param obj source object to check
 * @param message error will be thrown with
 * @return the passed object
 * @throws <code>Error(message)</code>, or <code>Error('nullable argument')</code>
 * if no any message has been provided
 */
export function requireNonNull<T>(obj: T | null | undefined, message?: string): T {
  if (isNullOrUndefined(obj)) {
    throw new Error(isNotNullOrEmpty(message) ? message : 'nullable argument');
  }
  return obj as T;
}

/**
 * Check a passed string against null/undefined and string length grater than 0.
 *
 * @param str source string to check
 * @param message error will be thrown with
 * @return the passed string
 * @throws <code>Error(message)</code>, or <code>Error('nullable or empty argument')</code>
 * if no any message has been provided
 */
export function requireNonEmpty(str: string | null | undefined, message?: string): string {
  if (isNullOrEmpty(str)) {
    throw new Error(isNotNullOrEmpty(message) ? message : 'nullable or empty argument');
  }

  return str as string;
}

export function isNotNullOrUndefined(obj: any): boolean {
  return !isNullOrUndefined(obj);
}

export function isNullOrUndefined(value: any): boolean {
  return value === undefined || value === null;
}
