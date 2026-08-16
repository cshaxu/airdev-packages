/* "@airdev/next": "managed" */

import { AirdevEdgeConfigBase } from '@/airdev/common/types/config';
import { edgeAppConfig } from '@/config/edge';
import { pick } from 'lodash-es';

export const airdevEdgeConfig: AirdevEdgeConfigBase = pick(edgeAppConfig, [
  'cronSecret',
  'internalSecret',
]);
