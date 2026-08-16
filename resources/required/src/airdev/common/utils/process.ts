/* "@airdev/next": "managed" */

import { wait } from '@airent/api';
import { Awaitable } from 'airent';
import { logError } from './logging';

export async function retry<T>(
  fn: () => Awaitable<T>,
  retries: number,
  delay: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      logError(error, { retries, delay });
      await wait(delay);
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
}

export async function safe<T>(fn: () => Awaitable<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error);
    return fallback;
  }
}

export async function retrySafe<T>(
  fn: () => Awaitable<T>,
  retries: number,
  delay: number,
  fallback: T
): Promise<T> {
  return await safe(() => retry(fn, retries, delay), fallback);
}
