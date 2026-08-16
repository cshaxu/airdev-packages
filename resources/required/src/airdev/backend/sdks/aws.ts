/* "@airdev/next": "managed" */

import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { logInfo, wait } from '@airent/api';
import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  GetDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommandOutput,
  StartDocumentTextDetectionCommand,
  StartDocumentTextDetectionCommandOutput,
  TextractClient,
} from '@aws-sdk/client-textract';
import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createHttpError from 'http-errors';

const AWS_CLIENT_CONFIG = {
  region: airdevPrivateConfig.aws.s3Region,
  credentials: {
    accessKeyId: airdevPrivateConfig.aws.accessKeyId,
    secretAccessKey: airdevPrivateConfig.aws.secretAccessKey,
  },
};

const LOCAL_AWS_BASE_URL = 'http://localhost:3333';
const LOCAL_AWS_S3_BASE_URL = `${LOCAL_AWS_BASE_URL}/s3`;
const LOCAL_AWS_TEXTRACT_BASE_URL = `${LOCAL_AWS_BASE_URL}/textract`;

const isDataLocal = airdevPublicConfig.service.dataEnvironment === 'local';

/** S3 Presigned */

export async function createS3PresignedPost(
  key: string,
  expiresInSeconds: number = 15 * 60 // 15 minutes
): Promise<PresignedPost> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/create-presigned-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  } else {
    const s3Client = new S3Client(AWS_CLIENT_CONFIG);
    const options = {
      ...payload,
      Fields: { key },
      Conditions: [
        // ['starts-with', '$Content-Type', 'image/'],
        ['content-length-range', 0, 100_000_000] as Conditions,
      ],
      Expires: expiresInSeconds,
    };
    return await createPresignedPost(s3Client, options);
  }
}

export async function createS3PresignedUrl(
  key: string,
  fileName: string,
  isPreview: boolean,
  fileMimeType: string | undefined,
  expiresInSeconds: number = 15 * 60
): Promise<string> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/create-presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.text());
  } else {
    const s3Client = new S3Client(AWS_CLIENT_CONFIG);
    const ResponseContentDisposition = `${isPreview ? 'inline' : 'attachment'}; filename="${fileName}"`;
    const options = {
      ...payload,
      ResponseContentDisposition,
      ...(fileMimeType !== undefined && { ResponseContentType: fileMimeType }),
    };
    const command = new GetObjectCommand(options);
    return await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }
}

/** S3 Object */

export async function getS3Object(
  key: string
): Promise<GetObjectCommandOutput> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    const response = await fetch(`${LOCAL_AWS_S3_BASE_URL}/get-object`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw createHttpError.BadGateway(
        `Failed to fetch S3 object "${key}" (${response.status})`
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    const body = Buffer.from(await response.arrayBuffer());
    const contentLengthHeader = response.headers.get('content-length');
    const contentLength = contentLengthHeader
      ? Number.parseInt(contentLengthHeader, 10)
      : body.length;

    return {
      $metadata: {},
      Body: body as unknown as GetObjectCommandOutput['Body'],
      ContentType: contentType || undefined,
      ContentLength: Number.isFinite(contentLength) ? contentLength : undefined,
    };
  }
  const s3Client = new S3Client(AWS_CLIENT_CONFIG);
  const command = new GetObjectCommand(payload);
  return await s3Client.send(command);
}

export async function headS3Object(
  key: string
): Promise<HeadObjectCommandOutput> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/head-object`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }
  const s3Client = new S3Client(AWS_CLIENT_CONFIG);
  const command = new HeadObjectCommand(payload);
  return await s3Client.send(command);
}

export async function getS3ObjectBytes(
  key: string,
  maxBytes: number = 8192
): Promise<Buffer> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    const response = await fetch(`${LOCAL_AWS_S3_BASE_URL}/get-object-bytes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, MaxBytes: maxBytes }),
    });
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  const s3Client = new S3Client(AWS_CLIENT_CONFIG);
  const command = new GetObjectCommand({
    ...payload,
    Range: `bytes=0-${maxBytes - 1}`,
  });
  const response = await s3Client.send(command);

  if (!response.Body) {
    return Buffer.alloc(0);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of response.Body as NodeJS.ReadableStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function uploadS3Object(
  key: string,
  body: File | Buffer
): Promise<PutObjectCommandOutput> {
  if (isDataLocal) {
    const formData = new FormData();
    formData.append('Bucket', airdevPublicConfig.aws.s3Bucket);
    formData.append('Key', key);
    const file =
      body instanceof File
        ? body
        : new File([new Uint8Array(body)], key, {
            type: 'application/octet-stream',
          });
    formData.append('file', file);
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/put-object`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  } else {
    const s3Client = new S3Client(AWS_CLIENT_CONFIG);
    const command = new PutObjectCommand({
      Bucket: airdevPublicConfig.aws.s3Bucket,
      Key: key,
      Body: body,
    });
    return await s3Client.send(command);
  }
}

export async function copyS3Object(
  srcKey: string,
  destKey: string
): Promise<CopyObjectCommandOutput> {
  const payload = {
    Bucket: airdevPublicConfig.aws.s3Bucket,
    CopySource: `${airdevPublicConfig.aws.s3Bucket}/${srcKey}`,
    Key: destKey,
  };
  if (isDataLocal) {
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/copy-object`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  } else {
    const s3Client = new S3Client(AWS_CLIENT_CONFIG);
    const command = new CopyObjectCommand(payload);
    return await s3Client.send(command);
  }
}

export async function deleteS3Object(
  key: string
): Promise<DeleteObjectCommandOutput> {
  const payload = { Bucket: airdevPublicConfig.aws.s3Bucket, Key: key };
  if (isDataLocal) {
    return await fetch(`${LOCAL_AWS_S3_BASE_URL}/delete-object`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  } else {
    const s3Client = new S3Client(AWS_CLIENT_CONFIG);
    const deleteCommand = new DeleteObjectCommand(payload);
    return await s3Client.send(deleteCommand);
  }
}

export async function listS3ObjectKeys(prefix: string): Promise<string[]> {
  if (isDataLocal) {
    return [];
  }
  const s3Client = new S3Client(AWS_CLIENT_CONFIG);
  const keys: string[] = [];
  let continuationToken: string | undefined = undefined;
  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: airdevPublicConfig.aws.s3Bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });
    const listResponse: ListObjectsV2CommandOutput =
      await s3Client.send(listCommand);
    for (const content of listResponse.Contents ?? []) {
      if (content.Key) {
        keys.push(content.Key);
      }
    }
    continuationToken = listResponse.IsTruncated
      ? listResponse.NextContinuationToken
      : undefined;
  } while (continuationToken);
  return keys;
}

export async function deleteS3Objects(
  keys: string[]
): Promise<DeleteObjectsCommandOutput | null> {
  if (keys.length === 0) {
    return null;
  }
  if (isDataLocal) {
    await Promise.all(keys.map((key) => deleteS3Object(key)));
    return null;
  }
  const s3Client = new S3Client(AWS_CLIENT_CONFIG);
  const command = new DeleteObjectsCommand({
    Bucket: airdevPublicConfig.aws.s3Bucket,
    Delete: {
      Objects: keys.map((Key) => ({ Key })),
      Quiet: true,
    },
  });
  return await s3Client.send(command);
}

/** Textract */

export async function startDocumentTextDetection(
  key: string
): Promise<StartDocumentTextDetectionCommandOutput> {
  const payload = {
    DocumentLocation: {
      S3Object: { Bucket: airdevPublicConfig.aws.s3Bucket, Name: key },
    },
  };
  if (isDataLocal) {
    return await fetch(
      `${LOCAL_AWS_TEXTRACT_BASE_URL}/start-document-text-detection`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    ).then((res) => res.json());
  }
  const client = new TextractClient(AWS_CLIENT_CONFIG);
  const command = new StartDocumentTextDetectionCommand(payload);
  return await client.send(command);
}

export async function getDocumentTextDetection(
  jobId: string,
  nextToken?: string
): Promise<GetDocumentTextDetectionCommandOutput> {
  const payload = { JobId: jobId, NextToken: nextToken };
  if (isDataLocal) {
    return await fetch(
      `${LOCAL_AWS_TEXTRACT_BASE_URL}/get-document-text-detection`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    ).then((res) => res.json());
  }
  const client = new TextractClient(AWS_CLIENT_CONFIG);
  return await client.send(new GetDocumentTextDetectionCommand(payload));
}

export async function getDocumentTextDetectionLoop(
  callback: (response: GetDocumentTextDetectionCommandOutput) => Promise<void>,
  jobId: string,
  nextToken?: string,
  maxDurationSeconds: number = 600
): Promise<boolean> {
  const startTime = new Date();

  let waitSeconds = 1;
  let jobStatus = 'SUCCEEDED';

  do {
    const durationSeconds = new Date().getTime() - startTime.getTime();
    const isExpired = durationSeconds > maxDurationSeconds * 1000;
    if (isExpired) {
      return false;
    }
    const response = await getDocumentTextDetection(jobId, nextToken);

    const { JobStatus, NextToken } = response;

    switch (JobStatus) {
      case 'IN_PROGRESS':
        jobStatus = 'IN_PROGRESS';
        waitSeconds = Math.min(10, waitSeconds * 2);
        logInfo(
          `Textract job "${jobId}" is in progress, waiting ${waitSeconds} seconds`
        );
        await wait(waitSeconds * 1000);
        break;
      case 'SUCCEEDED':
        jobStatus = 'SUCCEEDED';
        waitSeconds = 1;
        nextToken = NextToken;
        await callback(response);
        break;
      case 'FAILED':
        jobStatus = 'FAILED';
        throw createHttpError.InternalServerError(
          `Textract job "${jobId}" failed`
        );
    }
  } while (nextToken || jobStatus === 'IN_PROGRESS');

  return true;
}
