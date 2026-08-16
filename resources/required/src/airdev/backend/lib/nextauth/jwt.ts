/* "@airdev/next": "managed" */

import { buildInvalidErrorMessage } from '@airent/api';
import createHttpError from 'http-errors';
import { DefaultUser } from 'next-auth';
import { JWTDecodeParams, JWTEncodeParams, JWTOptions } from 'next-auth/jwt';

export const jwt: Partial<JWTOptions> = {
  encode: async (params: JWTEncodeParams) => /* Promise<string> */ {
    // Note: because we use database strategy, this will only be invoked when
    // the user signs in with CredentialsProvider. The session token is created
    // in the database and we hacked params.token.email field to pass the
    // sessionToken here. Caller of this function is here:
    // https://github.com/nextauthjs/next-auth/blob/98fbedcf772bb1d5b989d3182821fa4764bdf746/packages/core/src/lib/actions/callback/index.ts
    const json = JSON.parse(params.token!.email!);
    (params.token as unknown as DefaultUser).email = json.email;
    return json.sessionToken;
  },
  decode: async (_params: JWTDecodeParams) => /* Promise<JWT | null> */ {
    // Note: because we use database strategy for session tokens,
    // this will never be invoked
    throw createHttpError.NotImplemented(
      buildInvalidErrorMessage(
        'decode',
        'never allow JWT strategy and decoding in NextAuth'
      )
    );
  },
};
