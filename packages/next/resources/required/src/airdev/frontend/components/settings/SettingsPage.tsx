/* "@airdev/next": "managed" */

import { withError } from '@/airdev/frontend/utils/page';
import SettingsView from './SettingsView';

async function Page() {
  return <SettingsView />;
}

export default withError(Page);
