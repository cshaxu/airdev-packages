/* "@airdev/next": "managed" */

import * as AirentApi from '@airent/api';
import createHttpError from 'http-errors';
import { ZodError } from 'zod';

export function logError(error: any, context?: Record<string, any>): void {
  const normalizedError = normalizeError(error);
  AirentApi.logError(normalizedError, context, 1);
}

export function normalizeError(error: any): AirentApi.NormalizedError {
  return {
    ...normalizeErrorInternal(error),
    stack:
      !!error && 'stack' in error && typeof error.stack === 'string'
        ? error.stack.split('\n')
        : [],
    original: error,
  };
}

function normalizeErrorInternal(
  error: any
): Pick<AirentApi.NormalizedError, 'name' | 'status' | 'message'> {
  if (error instanceof createHttpError.HttpError) {
    return {
      name: error.name,
      status: error.status,
      message: error.message,
    };
  }
  if (error instanceof ZodError) {
    const httpError = createHttpError.BadRequest();
    return {
      name: httpError.name,
      status: httpError.status,
      message: error.issues
        .map(
          (issue) =>
            `${issue.message ? `${issue.message}: ` : ''}${issue.code} on [${issue.path.join(', ')}]`
        )
        .join('; '),
    };
  }
  const httpError = createHttpError.InternalServerError();
  return {
    name: httpError.name,
    status: httpError.status,
    message: !!error && 'message' in error ? error.message : httpError.name,
  };
}
