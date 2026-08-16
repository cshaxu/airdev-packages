/* "@airdev/next": "managed" */

import SignInPage, {
  generateSignInMetadata,
} from '@/airdev/frontend/components/auth/SignInPage';

export const dynamic = 'force-dynamic';

export const generateMetadata = generateSignInMetadata;

export default SignInPage;
