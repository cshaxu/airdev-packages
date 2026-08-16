/* "@airdev/next": "managed" */

import * as z from 'zod';

// params

export const GetOneNextauthVerificationTokenParams = z.object({
  email: z.email(),
  code: z.string(),
});
export type GetOneNextauthVerificationTokenParams = z.infer<
  typeof GetOneNextauthVerificationTokenParams
>;

// body

export const CreateOneNextauthVerificationTokenBody = z.object({
  email: z.email(),
});
export type CreateOneNextauthVerificationTokenBody = z.infer<
  typeof CreateOneNextauthVerificationTokenBody
>;
