/* "@airdev/next": "managed" */

import SystemScheduledJobService from '@/airdev/backend/services/data/system-scheduled-job';
import { Context } from '@/airdev/framework/context';

export const maxDuration = 300;

export const schedule = '5 0 * * *';

export const executor = (context: Context) =>
  SystemScheduledJobService.executeAll(context).then((result) => ({
    code: 200,
    result,
  }));
