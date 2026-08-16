/* "@airdev/next": "managed" */

import { airdevPrivateConfig } from '@/airdev/config/private';
import GoogleProvider from 'next-auth/providers/google';

export const googleProvider = GoogleProvider({
  clientId: airdevPrivateConfig.google.clientId,
  clientSecret: airdevPrivateConfig.google.clientSecret,
  allowDangerousEmailAccountLinking: true,
  authorization: { params: { include_granted_scopes: true } },
});
