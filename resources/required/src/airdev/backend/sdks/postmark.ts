/* "@airdev/next": "managed" */

import { PostmarkEmail } from '@/airdev/common/types/vendors/postmark';
import { logError } from '@/airdev/common/utils/logging';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { existify, logInfo } from '@airent/api';
import { pick } from 'lodash-es';
import { Client } from 'postmark';

export enum PostmarkTags {
  SYSTEM_VERIFICATION_CODE = 'SYSTEM_VERIFICATION_CODE',
  USER_COMMUNICATION_GENERIC = 'USER_COMMUNICATION_GENERIC',
}

export const sendOneEmail = (email: PostmarkEmail) =>
  sendManyEmails([email]).then(
    (a) => a.length === 1 && a[0] === email.receiver
  );

export async function sendManyEmails(
  emails: PostmarkEmail[]
): Promise<string[]> {
  const client = new Client(airdevPrivateConfig.postmark.apiToken);

  const data = emails.map((email) => ({
    MessageStream: email.stream,
    From: email.sender,
    To: email.receiver,
    Subject: email.subject,
    TextBody: email.textBody,
    HtmlBody: email.htmlBody,
    Attachments: email.attachments,
    Tag: email.tag,
    Metadata: email.metadata,
  }));

  try {
    logInfo(pick(data, ['From', 'To']));
    const results = await client.sendEmailBatch(data);
    return existify(results.filter((r) => r.ErrorCode === 0).map((r) => r.To));
  } catch (error) {
    logError(error, data);
    return [];
  }
}
