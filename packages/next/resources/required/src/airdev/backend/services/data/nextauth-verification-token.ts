/* "@airdev/next": "managed" */

import * as AuthDelivery from '@/airdev/backend/deliveries/auth';
import { NextauthVerificationTokenEntity } from '@/airdev/backend/entities/nextauth-verification-token';
import { createHash, generateCode } from '@/airdev/backend/utils/token';
import {
  CreateOneNextauthVerificationTokenBody,
  GetOneNextauthVerificationTokenParams,
} from '@/airdev/common/types/data/nextauth-verification-token';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { Context } from '@/airdev/framework/context';
import { Prisma } from '@prisma/client';
import { addMinutes } from 'date-fns';

// Note: https://github.com/nextauthjs/next-auth/blame/main/packages/core/src/lib/actions/signin/send-token.ts#L80
async function buildKey(
  email: string,
  code: string
): Promise<Prisma.NextauthVerificationTokenIdentifierTokenCompoundUniqueInput> {
  const token = await createHash(
    `${code}${airdevPrivateConfig.nextauth.secret}`
  );
  const identifier = email;
  return { identifier, token };
}

async function getOneSafe(
  params: GetOneNextauthVerificationTokenParams,
  context: Context
): Promise<NextauthVerificationTokenEntity | null> {
  const { email, code } = params;
  const key = await buildKey(email, code);
  const one = await NextauthVerificationTokenEntity.findUnique(
    { where: { identifier_token: key } },
    context
  );
  if (one === null) {
    return null;
  }
  if (one.expires.getTime() < context.time.getTime()) {
    return null;
  }
  return one;
}

async function createOne(
  body: CreateOneNextauthVerificationTokenBody,
  context: Context
): Promise<NextauthVerificationTokenEntity> {
  const { email } = body;
  const code = generateCode(5, '123456789');
  const key = await buildKey(email, code);
  const expires = addMinutes(context.time, 15);
  await AuthDelivery.sendEmail(code, key.identifier);
  return await NextauthVerificationTokenEntity.upsert(
    {
      where: { identifier_token: key },
      create: { ...key, expires },
      update: { expires },
    },
    context
  );
}

async function deleteOneSafe(
  key: { email: string; code: string },
  context: Context
): Promise<NextauthVerificationTokenEntity | null> {
  const one = await getOneSafe(key, context);
  if (one === null) {
    return null;
  }
  const { identifier, token } = one;
  return await NextauthVerificationTokenEntity.delete(
    { where: { identifier_token: { identifier, token } } },
    context
  );
}

const NextauthVerificationTokenService = {
  getOneSafe,
  createOne,
  deleteOneSafe,
};

export default NextauthVerificationTokenService;
