/* "@airdev/next": "managed" */

import SystemRequestCacheService from '@/airdev/backend/services/data/system-request-cache';
import { Context } from '@/airdev/framework/context';
import { CommonResponse } from '@airent/api';

export const maxDuration = 300;

export const schedule = '10 0 * * *';

export const executor = (context: Context) =>
  SystemRequestCacheService.deleteManyByTime(context.time).then(
    (count) => ({ code: 200, result: { count } }) as CommonResponse
  );
