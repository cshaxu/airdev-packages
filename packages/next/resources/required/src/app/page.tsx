/* "@airdev/next": "managed" */

import RootPage, {
  generateRootPageMetadata,
} from '@/airdev/frontend/components/shell/RootPage';

export const dynamic = 'force-dynamic';
export const generateMetadata = generateRootPageMetadata;
export default RootPage;
