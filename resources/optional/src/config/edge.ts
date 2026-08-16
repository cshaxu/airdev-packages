/* "@airdev/next": "seeded" */

import { AirdevEdgeConfigBase } from '@/airdev/common/types/config';

const INTERNAL_SECRET = process.env.BAREBONE_NEXT_INTERNAL_SECRET!;
const CRON_SECRET = process.env.CRON_SECRET ?? INTERNAL_SECRET;

export const edgeAppConfig: AirdevEdgeConfigBase = {
  cronSecret: CRON_SECRET,
  internalSecret: INTERNAL_SECRET,
};
