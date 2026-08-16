/* "@airdev/next": "managed" */

import NextauthVerificationTokenService from '@/airdev/backend/services/data/nextauth-verification-token';
import AirdevUserService from '@/airdev/backend/services/data/user-base';
import { mockContext } from '@/airdev/backend/utils/context';
import { pick } from 'lodash-es';
import CredentialsProvider from 'next-auth/providers/credentials';

// Note:
// Official Guide: https://next-auth.js.org/configuration/providers/credentials
// Workaround to overcome the tech-religious limitation imposed by NextAuth team:
// https://github.com/nextauthjs/next-auth/discussions/4394
// https://nneko.branche.online/next-auth-credentials-provider-with-the-database-session-strategy/
// We DID NOT follow the official guide or the outdated workaround.
// See callbacks.ts and jwt.ts for our approach.
export const codeProvider = CredentialsProvider({
  name: 'Code',
  credentials: {
    email: { label: 'Email', type: 'text', placeholder: 'your@email.com' },
    code: { label: 'Code', type: 'text', placeholder: '12345' },
  },
  async authorize(
    credentials: Record<string | number | symbol, string> | undefined
  ) {
    if (credentials === undefined) {
      return null;
    }
    const context = await mockContext();
    const nextauthVerificationToken =
      await NextauthVerificationTokenService.deleteOneSafe(
        pick(credentials, ['email', 'code']),
        context
      );
    if (nextauthVerificationToken === null) {
      return null;
    }
    const { identifier: email } = nextauthVerificationToken;
    const user = await AirdevUserService.getOrCreateOne(email, context);
    const verifiedUser = await AirdevUserService.updateOneInternal(user, {
      emailVerified: context.time,
    });
    return {
      ...pick(verifiedUser, ['id', 'name', 'email', 'emailVerified']),
      image: user.imageUrl,
      source: 'email',
    };
  },
});
