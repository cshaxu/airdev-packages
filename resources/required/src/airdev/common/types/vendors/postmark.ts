/* "@airdev/next": "managed" */

import { Attachment } from 'postmark';
import { Hash } from 'postmark/dist/client/models';
import * as z from 'zod';

export type PostmarkEmail = {
  stream: string;
  sender: string;
  receiver: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  tag?: string;
  attachments?: Attachment[];
  metadata?: Hash<string>;
};

export const PostmarkWebhookBody = z.object({
  RecordType: z.string(),
  MessageID: z.string().nullable(),
  ServerID: z.number(),
  MessageStream: z.string(),
  ChangedAt: z.coerce.date(),
  Recipient: z.string(),
  Origin: z.enum(['Recipient', 'Customer', 'Admin']),
  SuppressSending: z.boolean(),
  SuppressionReason: z
    .enum(['HardBounce', 'SpamComplaint', 'ManualSuppression'])
    .nullable(),
  Tag: z.string().nullable(),
  Metadata: z.record(z.string(), z.any()),
});
export type PostmarkWebhookBody = z.infer<typeof PostmarkWebhookBody>;
