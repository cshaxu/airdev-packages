/* "@airdev/next": "managed" */

import { AUTH_ERROR_HREF, AUTH_SIGNIN_HREF } from '@/airdev/common/constant';
import { PagesOptions } from 'next-auth';

// Redirect passed in query string as ?next=
// Error code passed in query string as ?error=
export const pages: Partial<PagesOptions> = {
  signIn: AUTH_SIGNIN_HREF,
  error: AUTH_ERROR_HREF,
};
