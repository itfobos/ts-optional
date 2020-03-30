export function isNullOrEmpty(srcStr: string | null | undefined): boolean {
  return srcStr === undefined || srcStr === null || srcStr.length === 0;
}

export function isNotNullOrEmpty(srcStr: string | null | undefined): boolean {
  return !isNullOrEmpty(srcStr);
}
