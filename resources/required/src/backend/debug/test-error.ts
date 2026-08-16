/* "@airdev/next": "managed" */

import { Context } from '@/airdev/framework/context';
import { CommonResponse, parseBodyWith } from '@airent/api';
import createHttpError from 'http-errors';
import * as z from 'zod';

export const Params = z.object({});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export async function executor(
  _params: Params,
  _context: Context
): Promise<CommonResponse> {
  throw createHttpError.InternalServerError('something');
}
