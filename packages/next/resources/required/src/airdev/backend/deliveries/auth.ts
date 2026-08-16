/* "@airdev/next": "managed" */

import * as PostmarkSdk from '@/airdev/backend/sdks/postmark';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import VerificationCode from '@/airdev/emails/VerificationCode';
import { render } from '@react-email/render';

export async function sendEmail(
  code: string,
  receiver: string
): Promise<boolean> {
  const subject = `${code} is your ${airdevPublicConfig.app.name} sign-in code`;
  const payload = { subject, code };

  const stream = airdevPrivateConfig.postmark.defaultTransactionStream;
  const htmlBody = await render(VerificationCode(payload));

  const email = {
    stream,
    sender: airdevPrivateConfig.email.noReplySender,
    receiver,
    subject,
    htmlBody,
    tag: PostmarkSdk.PostmarkTags.SYSTEM_VERIFICATION_CODE,
    metadata: {},
  };
  return await PostmarkSdk.sendOneEmail(email);
}
