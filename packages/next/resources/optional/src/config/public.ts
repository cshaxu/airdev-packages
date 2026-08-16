/* "@airdev/next": "seeded" */

// Note: anything added here will be leaked to the public, use caution!

import {
  AirdevPublicConfigBase,
  EnvironmentBase,
} from '@/airdev/common/types/config';
import { pick } from 'lodash-es';
import PublicConfigJson from '../../public.config.json';

// env vars, do not move

const SERVICE_ENVIRONMENT = process.env
  .NEXT_PUBLIC_BAREBONE_NEXT_SERVICE_ENVIRONMENT as EnvironmentBase;
const DATA_ENVIRONMENT = process.env
  .NEXT_PUBLIC_BAREBONE_NEXT_DATA_ENVIRONMENT as EnvironmentBase;

// config loader, do not move

const { data: publicDataConfig, service: publicServiceConfig } =
  PublicConfigJson;
const publicEnvironmentalServiceConfig =
  publicServiceConfig[SERVICE_ENVIRONMENT];
const publicEnvironmentalDataConfig = publicDataConfig[DATA_ENVIRONMENT];

const service = {
  ...pick(publicEnvironmentalServiceConfig, [
    'baseUrl',
    'rootDomain',
    'titlePrefix',
    'name',
  ]),
  apiClientBaseUrl:
    typeof window === 'undefined'
      ? publicEnvironmentalServiceConfig.baseUrl
      : '',
  dataEnvironment: DATA_ENVIRONMENT,
  serviceEnvironment: SERVICE_ENVIRONMENT,
};

const { app, defaults, google, posthog } = PublicConfigJson;
const shell = PublicConfigJson.shell as AirdevPublicConfigBase['shell'];

const aws = { s3Bucket: publicEnvironmentalDataConfig.aws.s3Bucket };

export const baseUrl = `${service.apiClientBaseUrl}/api/data`;

export const publicAppConfig = {
  app,
  defaults,
  shell,
  service,
  aws,
  google,
  posthog,
};
