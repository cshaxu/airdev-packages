/* "@airdev/next": "managed" */

import { intersectionWith, isEqual, isNil } from 'lodash-es';

export type DeepNonNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<Exclude<T[K], null>> // Recursively apply the transformation
    : Exclude<T[K], null>;
};

export const intersect = <T>(a: T[], b: T[]) =>
  intersectionWith(a, b, isEqual).length > 0;

function toSnakeCase(s: string): string {
  return s
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

function toCamelCase(s: string): string {
  return s
    .trim()
    .replace(/[_\s-]+([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^(.)/, (match) => match.toLowerCase());
}

export function toSnakeCaseJson(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCaseJson);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toSnakeCase(key),
        toSnakeCaseJson(value),
      ])
    );
  }
  return obj;
}

export function toCamelCaseJson(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseJson);
  } else if (!isNil(obj) && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        toCamelCaseJson(value),
      ])
    );
  }
  return obj;
}

export function mergeObjects<T>(objects: T[]): T {
  return objects.reduce((acc, obj) => ({ ...obj, ...acc }), {} as T);
}

export function dedup<T>(array: T[], mapper: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of array) {
    const key = mapper(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export function exclude<T>(
  array: T[],
  target: T[],
  mapper: (item: T) => string
): T[] {
  const keys = new Set(target.map(mapper));
  return array.filter((item) => !keys.has(mapper(item)));
}

export function flattenObject(obj: object): Record<string, any> {
  if (typeof obj !== 'object') {
    throw new Error('input must be a JSON object');
  }
  if (obj === null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.reduce(
      (acc, o, i) => {
        acc[i.toString()] = flattenObject(o);
        return acc;
      },
      {} as Record<string, any>
    );
  }
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const nested = flattenObject(value);
        Object.entries(nested).forEach(([nestedKey, nestedValue]) => {
          acc[`${key}.${nestedKey}`] = nestedValue;
        });
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );
}
