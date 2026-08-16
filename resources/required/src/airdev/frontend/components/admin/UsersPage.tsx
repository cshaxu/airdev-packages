/* "@airdev/next": "managed" */

import { withError } from '@/airdev/frontend/utils/page';
import UserSearch from './UserSearch';

function Page() {
  return <UserSearch />;
}

const SafePage = withError(Page);
export default SafePage;
