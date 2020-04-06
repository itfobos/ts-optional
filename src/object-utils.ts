import { isNotNullOrEmpty, isNullOrEmpty } from './string-utils';


export function requireNonNull<T>(obj: T | null | undefined, message?: string): T {
  if (isNullOrUndefined(obj)) {
    throw new Error(isNotNullOrEmpty(message) ? message : 'nullable argument');
  }
  return obj as T;
}

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
