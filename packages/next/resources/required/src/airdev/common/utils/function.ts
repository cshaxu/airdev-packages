/* "@airdev/next": "managed" */

export async function withRetry<T>(
  func: () => Promise<T>,
  retry: number
): Promise<T> {
  while (true) {
    try {
      return await func();
    } catch (error) {
      if (retry > 0) {
        retry--;
      } else {
        throw error;
      }
    }
  }
}
