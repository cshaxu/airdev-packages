/* "@airdev/next": "managed" */

import { handleBackendJsonJsonWith } from '@/airdev/backend/lib/handlers';
import * as AwsSdk from '@/airdev/backend/sdks/aws';
import { CreateS3PresignedPostBody } from '@/common/types/api/json';

const executor = (body: CreateS3PresignedPostBody) =>
  AwsSdk.createS3PresignedPost(body.key);

export const POST = handleBackendJsonJsonWith({
  bodyZod: CreateS3PresignedPostBody,
  executor,
});
