/* "@airdev/next": "managed" */

'use client';

import { airdevPublicConfig } from '@/airdev/config/public';
import { parseAsBoolean, useQueryState } from 'nuqs';
import posthog from 'posthog-js';
import { useEffect } from 'react';

let initialized = false;

export default function PosthogInit() {
  const [forcePosthog] = useQueryState('forcePosthog', parseAsBoolean);
  useEffect(() => {
    if (
      initialized ||
      (airdevPublicConfig.service.serviceEnvironment !== 'production' &&
        !forcePosthog)
    ) {
      return;
    }
    posthog.init(airdevPublicConfig.posthog.apiToken, {
      api_host: airdevPublicConfig.posthog.apiHost,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture
    });
    initialized = true;
  }, [forcePosthog]);
  return null;
}
