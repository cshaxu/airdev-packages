/* "@airdev/next": "seeded" */

import Dashboard from '@/airdev/frontend/components/shell/Dashboard';
import { withError } from '@/airdev/frontend/utils/page';

async function Page() {
  return <Dashboard />;
}

const SafePage = withError(Page);
export default SafePage;
