/* "@airdev/next": "managed" */

import { mockContext } from '@/airdev/backend/utils/context';
import { logError, normalizeError } from '@/airdev/common/utils/logging';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { Context } from '@/airdev/framework/context';
import { CommonResponse, logInfo, logWarn } from '@airent/api';
import { Inngest } from 'inngest';
import { pick } from 'lodash-es';

type InngestEvent = { name: string; data: any };

export const inngest = new Inngest({ id: airdevPublicConfig.app.id });

export async function enqueue(type: string, data: any): Promise<boolean> {
  const event: InngestEvent = { name: type, data };
  try {
    logInfo({ type, data });
    await inngest.send(event);
    return true;
  } catch (error) {
    logError(error, { type, data });
    return false;
  }
}

type InngestOptions = { delaySeconds?: number; runAt?: Date };

async function onFailure(params: any): Promise<void> {
  const text = `[INNGEST] failed: ${JSON.stringify(params)}`;
  logWarn({ text });
}

export const createFunction = (
  event: string,
  executor: (params: any, context: Context) => Promise<CommonResponse>,
  options: InngestOptions = pick(airdevPrivateConfig.database, 'delaySeconds')
) =>
  inngest.createFunction(
    { id: `${event}-handler`, retries: 1, onFailure, triggers: [{ event }] },
    async ({ event, step }) => {
      const fn = async () => {
        try {
          const context = await mockContext();
          return await executor(event.data, context);
        } catch (error) {
          const normalizedError = normalizeError(error);
          logError(normalizedError, { event });
          return { code: normalizedError.status, error: normalizedError };
        }
      };
      if (options.runAt !== undefined) {
        await step.sleepUntil('wait-for-timestamp', options.runAt);
        await step.run('run-executor', fn);
      } else if (options.delaySeconds !== undefined) {
        await step.sleep('wait-for-delay', options.delaySeconds * 1000);
        await step.run('run-executor', fn);
      } else {
        await fn();
      }
    }
  );
