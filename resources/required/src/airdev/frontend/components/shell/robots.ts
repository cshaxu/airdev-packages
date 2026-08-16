/* "@airdev/next": "managed" */

import {
  ADMIN_HREF,
  API_HREF,
  AUTH_HREF,
  SETTINGS_HREF,
} from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import { MetadataRoute } from 'next';

export function generateRootRobots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: [
          ADMIN_HREF,
          API_HREF,
          AUTH_HREF,
          SETTINGS_HREF,
          airdevPublicConfig.shell.routes.homeHref,
          ...airdevPublicConfig.shell.routes.disallowRobots,
        ],
      },
    ],
    sitemap: `${airdevPublicConfig.service.baseUrl}/sitemap.xml`,
    host: airdevPublicConfig.service.baseUrl,
  };
}
