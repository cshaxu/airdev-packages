/* "@airdev/next": "seeded" */

import { AirdevClientComponentConfig } from '@/airdev/common/types/config';
import LandingPage from '@/airdev/frontend/components/landing/Landing';
import NavContent from '@/app/(protected)/components/NavContent';

export const clientComponentConfig: AirdevClientComponentConfig = {
  NavContent,
  LandingPage,
  SettingsContent: undefined,
};
