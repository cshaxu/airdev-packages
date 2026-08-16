/* "@airdev/next": "managed" */

import { backupToS3 } from '@/airdev/backend/services/system/backup';
import { Context } from '@/airdev/framework/context';
import { CommonResponse, parseBodyWith } from '@airent/api';
import * as z from 'zod';

export const Params = z.object({});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export async function executor(
  _params: Params,
  context: Context
): Promise<CommonResponse> {
  const result = await backupToS3(context.time);
  return { code: 200, result } as CommonResponse;
}
