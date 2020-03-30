export function isNullOrEmptyArray(arr: any[] | null | undefined): boolean {
  return arr === undefined || arr === null || arr.length === 0;
}

export function isNotNullOrEmptyArray(arr: any[] | null | undefined): boolean {
  return !isNullOrEmptyArray(arr);
}
