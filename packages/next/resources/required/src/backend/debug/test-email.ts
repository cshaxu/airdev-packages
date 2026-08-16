/* "@airdev/next": "managed" */

import * as AuthDelivery from '@/airdev/backend/deliveries/auth';
import { Context } from '@/airdev/framework/context';
import { CommonResponse, parseBodyWith } from '@airent/api';
import * as z from 'zod';

export const Params = z.object({
  code: z.string(),
  email: z.string().email(),
});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export async function executor(
  params: Params,
  _context: Context
): Promise<CommonResponse> {
  const { code, email } = params;
  await AuthDelivery.sendEmail(code, email);
  return { code: 200, result: {} } as CommonResponse;
}
