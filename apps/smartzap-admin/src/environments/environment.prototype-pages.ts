import { CoreConfig, apps_stage, commonEnvConfig, FeatureFlags } from '@keeps-platform-frontend-workspace/kp-keeps';

const apps = apps_stage;
const production = false;

const keycloakConfig = {
  url: 'https://prototype.local/keycloak',
  realm: 'prototype',
  clientId: 'smartzap-admin-prototype-pages',
};

const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiSmartzapAdminUrl: apps.smartzap.api,
    apiPushManagerUrl: apps.pushManager.api,
  },
  appId: apps.smartzap.id,
  production,
};

const featureFlags: FeatureFlags = {
  'push-manager': false,
};

export const environment = {
  ...commonEnvConfig,
  id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
  name: 'Smartzap Admin Prototype Pages',
  production,
  prototypeMode: true,
  pagesMode: true,
  appBaseHref: '/smartzap-prototype/',
  enableServiceWorker: false,
  enableUpdates: false,
  enableMonitoring: false,
  link: {
    help: '#',
    xls: '#',
    myaccount: '#',
  },
  keycloakConfig,
  bearerUrls: [],
  apps,
  routeHome: 'courses',
  coreModuleConfig,
  workspacesPageLogo: 'assets/branding/smartzap-double-check.svg',
  featureFlags,
};
