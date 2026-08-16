/* "@airdev/next": "managed" */

import { airdevPrivateConfig } from '@/airdev/config/private';
import { AuthOptions } from 'next-auth';
import { adapter } from './adapter';
import { callbacks } from './callbacks';
import { cookies } from './cookies';
import { jwt } from './jwt';
import { pages } from './pages';
import { codeProvider } from './providers/code';
import { googleProvider } from './providers/google';

export const authOptions: AuthOptions = {
  cookies,
  pages,
  session: { maxAge: airdevPrivateConfig.nextauth.sessionMaxAge },
  adapter,
  providers: [googleProvider, codeProvider],
  callbacks,
  jwt,
};
