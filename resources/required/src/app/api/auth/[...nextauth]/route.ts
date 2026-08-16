/* "@airdev/next": "managed" */

import { authOptions } from '@/airdev/backend/lib/nextauth';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
