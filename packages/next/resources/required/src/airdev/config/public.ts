/* "@airdev/next": "managed" */

import type { AirdevPublicConfigBase } from '@/airdev/common/types/config';
import { publicAppConfig } from '@/config/public';
import { pick } from 'lodash-es';

export const baseUrl = `${publicAppConfig.service.apiClientBaseUrl}/api/data`;

export const airdevPublicConfig: AirdevPublicConfigBase = {
  ...pick(publicAppConfig, ['app', 'defaults', 'shell', 'aws', 'posthog']),
  service: pick(publicAppConfig.service, [
    'apiClientBaseUrl',
    'baseUrl',
    'dataEnvironment',
    'rootDomain',
    'serviceEnvironment',
    'titlePrefix',
  ]),
};
