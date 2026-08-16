/* "@airdev/next": "managed" */

import { airdevEdgeConfig } from '@/airdev/config/edge';
import { buildHeaders, getCurrentUser } from '@/airdev/edge/sdks/backend';
import { commonHandlerConfig } from '@/airdev/framework/callbacks';
import { Context } from '@/airdev/framework/context';
import { HandlerConfig } from '@airent/api-next';

export const edgeHandlerConfig: HandlerConfig<Context, any, any, any, any> = {
  ...commonHandlerConfig,
  authenticator,
};

async function authenticator(request: Request): Promise<Context> {
  const time = new Date();
  const { method, url, headers: originalHeaders } = request;
  const headers = buildHeaders(originalHeaders, {
    additionalEntries: { 'X-INTERNAL-SECRET': airdevEdgeConfig.internalSecret },
  });
  const currentUser = await getCurrentUser(headers);
  return { time, method, url, headers, currentUser };
}
