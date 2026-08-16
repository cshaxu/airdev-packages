/* "@airdev/next": "managed" */

import { Context } from '@/airdev/framework/context';
import { Awaitable } from 'airent';

export enum SystemScheduledJobStatus {
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
  PURGED = 'PURGED',
}

export type SystemScheduledJobResult = {
  status: SystemScheduledJobStatus;
  nextRunsAt?: Date;
  peerId?: string;
  result?: any;
};

export type SystemScheduledJobExecutor = (
  params: any,
  context: Context
) => Awaitable<SystemScheduledJobResult>;

export type SystemScheduledJobExecution = SystemScheduledJobResult & {
  startsAt: Date;
  endsAt: Date;
};
