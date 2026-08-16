/* "@airdev/next": "managed" */

/* eslint-disable airdev/no-specific-string */
import prisma from '@/airdev/backend/lib/prisma';
import { buildInvalidErrorMessage, purify } from '@airent/api';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import createHttpError from 'http-errors';
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';

export const adapter: Adapter = {
  ...PrismaAdapter(prisma),
  createUser: (_data: any) => {
    throw createHttpError.NotImplemented(
      buildInvalidErrorMessage(
        'createUser',
        'never allow user create through NextAuth'
      )
    );
  },
  getUserByAccount: async (
    provider_providerAccountId: Prisma.NextauthAccountProviderProviderAccountIdCompoundUniqueInput
  ) => {
    const account = await prisma.nextauthAccount.findUnique({
      where: { provider_providerAccountId },
      include: { user: true },
    });
    return (account?.user as AdapterUser) ?? null;
  },
  updateUser: (_data: any) => {
    throw createHttpError.NotImplemented(
      buildInvalidErrorMessage(
        'createUser',
        'never allow user update through NextAuth'
      )
    );
  },
  deleteUser: (_id: string) => {
    throw createHttpError.NotImplemented(
      buildInvalidErrorMessage(
        'deleteUser',
        'never allow user delete through NextAuth'
      )
    );
  },
  linkAccount: (data: AdapterAccount) =>
    prisma.nextauthAccount.create({ data }) as unknown as AdapterAccount,
  unlinkAccount: (
    provider_providerAccountId: Prisma.NextauthAccountProviderProviderAccountIdCompoundUniqueInput
  ) =>
    prisma.nextauthAccount.delete({
      where: { provider_providerAccountId },
    }) as unknown as AdapterAccount,
  getSessionAndUser: async (sessionToken: string) => {
    const userAndSession = await prisma.nextauthSession.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!userAndSession) {
      return null;
    }
    const { user, ...session } = userAndSession;
    return { user, session } as { user: AdapterUser; session: AdapterSession };
  },
  createSession: (data) =>
    prisma.nextauthSession.create({ data: purify(data) }),
  updateSession: (data) =>
    prisma.nextauthSession.update({
      where: { sessionToken: data.sessionToken },
      data: purify(data),
    }),
  deleteSession: (sessionToken: string) =>
    prisma.nextauthSession.delete({ where: { sessionToken } }),
  createVerificationToken: async (data: VerificationToken) => {
    const verificationToken = await prisma.nextauthVerificationToken.create({
      data: purify(data),
    });
    if ('id' in verificationToken && verificationToken.id) {
      delete verificationToken.id;
    }
    return verificationToken;
  },
  useVerificationToken: async (identifier_token) => {
    try {
      const verificationToken = await prisma.nextauthVerificationToken.delete({
        where: { identifier_token },
      });
      if ('id' in verificationToken && verificationToken.id) {
        delete verificationToken.id;
      }
      return verificationToken;
    } catch (error: unknown) {
      // If token already used/deleted, just return null
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  },
  // @ts-expect-error
  getAccount: (providerAccountId: string, provider: string) =>
    prisma.nextauthAccount.findFirst({
      where: { providerAccountId, provider },
    }) as Promise<AdapterAccount | null>,
};
