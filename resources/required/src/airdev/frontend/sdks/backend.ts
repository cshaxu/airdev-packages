/* "@airdev/next": "managed" */

import { callBackendApi } from '@/airdev/frontend/lib/backend';

const become = (userId: string | null) =>
  callBackendApi('/api/auth/become', { userId });

const AirdevBackendApiClient = { become };

export default AirdevBackendApiClient;
