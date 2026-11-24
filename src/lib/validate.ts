/**
 * Small type guards for validating data read from localStorage on the client. The stores
 * validate two small shapes, which does not justify a schema library in the first-load
 * JavaScript (ADR-0009). Content schemas (tests, build time) keep using Zod.
 */

/** A plain object (not null, not an array). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** One of the given literal options. */
export function isOneOf<const T extends readonly unknown[]>(
  options: T,
  value: unknown,
): value is T[number] {
  return options.includes(value);
}

/** An object whose every value passes `isValue`. */
export function isRecordOf<T>(
  value: unknown,
  isValue: (item: unknown) => item is T,
): value is Record<string, T> {
  return isRecord(value) && Object.values(value).every(isValue);
}

export const isString = (value: unknown): value is string => typeof value === "string";

/** `undefined` or a string. */
export const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value);
