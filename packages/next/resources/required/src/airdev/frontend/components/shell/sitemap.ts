/* "@airdev/next": "managed" */

import { PRIVACY_HREF, TERMS_HREF } from '@/airdev/common/constant';
import { airdevPublicConfig } from '@/airdev/config/public';
import { MetadataRoute } from 'next';

export function generateRootSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: airdevPublicConfig.service.baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: new URL(PRIVACY_HREF, airdevPublicConfig.service.baseUrl).toString(),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: new URL(TERMS_HREF, airdevPublicConfig.service.baseUrl).toString(),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
