/* "@airdev/next": "managed" */

import type { ComponentType, ReactNode } from 'react';

export type EnvironmentBase = 'local' | 'production';

export type Environment = EnvironmentBase | (string & {});

export type ShellStyleColor =
  | 'blue'
  | 'black'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'pink'
  | 'orange';

export type ShellStyleFont = {
  src: string;
  format: 'woff2' | 'woff' | 'truetype' | 'opentype';
};

export type AirdevPublicConfigBase = {
  app: {
    id: string;
    name: string;
    description: string;
    owner: string;
    ownerShort: string;
    logoUrl: string;
    email: string;
    welcomeText: string;
    keywords: string[];
    categories: string[];
  };
  service: {
    apiClientBaseUrl: string;
    baseUrl: string;
    rootDomain: string;
    titlePrefix: string;
    dataEnvironment: Environment;
    serviceEnvironment: Environment;
  };
  defaults: { apiBatchSize: number; pageSize: number };
  shell: {
    routes: {
      homeHref: string;
      disallowRobots: string[];
      defaultSideNavCollapsedRoutes: string[];
    };
    assets: { logoSrc: string; iconSrc: string };
    style: { color: ShellStyleColor; font: ShellStyleFont };
    adminTabs: { href: string; label: string }[];
  };
  aws: { s3Bucket: string };
  posthog: { apiToken: string; apiHost: string };
};

export type DatabaseBackupRetention = 'none' | 'history' | 'latest';

export type AirdevPrivateConfigBase = {
  admin: { emails: string[] };
  database: {
    backup: { csv: boolean; retention: DatabaseBackupRetention };
    batchSize: number;
    delaySeconds: number;
    url: string;
  };
  email: { noReplySender: string };
  nextauth: { secret: string; sessionMaxAge: number };
  aws: { accessKeyId: string; secretAccessKey: string; s3Region: string };
  google: { clientId: string; clientSecret: string };
  postmark: { apiToken: string; defaultTransactionStream: string };
};

export type AirdevEdgeConfigBase = {
  cronSecret: string;
  internalSecret: string;
};

type X = Record<string, unknown>;
export type AirdevPublicConfig = AirdevPublicConfigBase & X;
export type AirdevPrivateConfig = AirdevPrivateConfigBase & X;
export type AirdevEdgeConfig = AirdevEdgeConfigBase & X;

export type ShellNavItem = {
  to: string;
  label: string;
  renderIcon: (className: string) => ReactNode;
  isActive: (pathname: string) => boolean;
};

export type AirdevClientComponentConfig = {
  NavContent: () => { navItems: ShellNavItem[] };
  LandingPage?: ComponentType;
  SettingsContent?: ComponentType<{ userId: string }>;
};
