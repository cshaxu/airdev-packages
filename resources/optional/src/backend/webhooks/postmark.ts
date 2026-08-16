/* "@airdev/next": "seeded" */

import { PostmarkWebhookBody } from '@/airdev/common/types/vendors/postmark';
import { Context } from '@/airdev/framework/context';
import { privateAppConfig } from '@/config/private';
import { buildInvalidErrorMessage, parseBodyWith } from '@airent/api';
import createHttpError from 'http-errors';

export function authorizer(context: Context): void {
  const { headers } = context;
  const secret = headers.get(privateAppConfig.postmark.webhookSecretHeaderKey);
  if (secret !== privateAppConfig.postmark.webhookSecret) {
    throw createHttpError.Forbidden(buildInvalidErrorMessage('access'));
  }
}

export const Params = PostmarkWebhookBody;

export async function parser(request: Request): Promise<PostmarkWebhookBody> {
  return await parseBodyWith(Params)(request);
}

export const executor = async (
  _body: PostmarkWebhookBody,
  _context: Context
) => {
  return { success: true };
};
