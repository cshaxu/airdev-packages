/* "@airdev/next": "managed" */

import { handleBackendJsonJsonWith } from '@/airdev/backend/lib/handlers';
import * as AwsSdk from '@/airdev/backend/sdks/aws';
import { CreateS3PresignedUrlBody } from '@/common/types/api/json';

const executor = (body: CreateS3PresignedUrlBody) =>
  AwsSdk.createS3PresignedUrl(
    body.key,
    body.fileName,
    body.isPreview,
    body.fileMimeType
  ).then((url) => ({ url }));

export const POST = handleBackendJsonJsonWith({
  bodyZod: CreateS3PresignedUrlBody,
  executor,
});
