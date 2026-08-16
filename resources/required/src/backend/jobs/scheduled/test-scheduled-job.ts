/* "@airdev/next": "managed" */

import {
  SystemScheduledJobResult,
  SystemScheduledJobStatus,
} from '@/airdev/common/types/data/system-scheduled-job';
import { Context } from '@/airdev/framework/context';

export const event = 'test-scheduled-job';

export type Params = { text: string };

export async function executor(
  params: Params,
  _context: Context
): Promise<SystemScheduledJobResult> {
  return { status: SystemScheduledJobStatus.COMPLETED, result: params };
}
