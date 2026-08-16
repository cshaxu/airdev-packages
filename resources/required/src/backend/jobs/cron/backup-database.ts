/* "@airdev/next": "managed" */

import { backupToS3 } from '@/airdev/backend/services/system/backup';
import { toDs, toStartTime } from '@/airdev/common/utils/date';
import { Context } from '@/airdev/framework/context';

export const maxDuration = 300;

export const schedule = '1 0 * * *';

export const executor = (context: Context) =>
  backupToS3(toStartTime(toDs(context.time)));
