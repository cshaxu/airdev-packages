/* "@airdev/next": "managed" */

import { withError } from '@/airdev/frontend/utils/page';
import AirentApiNextStudio from '@/generated/airent-api-next-studio';

async function Page() {
  return <AirentApiNextStudio />;
}

const SafePage = withError(Page);
export default SafePage;
