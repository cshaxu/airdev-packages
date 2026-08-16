/* "@airdev/next": "managed" */

import { Context } from '@/airdev/framework/context';
import { scheduleTestScheduledJobEvent } from '@/generated/scheduler';
import { CommonResponse, parseBodyWith } from '@airent/api';
import { addMinutes } from 'date-fns';
import * as z from 'zod';

export const Params = z.object({
  text: z.string(),
  delayMinutes: z.number(),
});
export type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export async function executor(
  params: Params,
  context: Context
): Promise<CommonResponse> {
  await scheduleTestScheduledJobEvent(
    { text: params.text },
    addMinutes(context.time, params.delayMinutes),
    context
  );
  return { code: 200, result: params };
}
