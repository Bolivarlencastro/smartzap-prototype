import { CoreConfig, apps_stage, commonEnvConfig, FeatureFlags } from '@keeps-platform-frontend-workspace/kp-keeps';
const apps = apps_stage;
const production = false;

const keycloakConfig = {
  url: 'https://auth.example.com/auth',
  realm: 'keeps',
  clientId: 'smartzap-admin-frontend',
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
  'push-manager': true,
};

export const environment = {
  ...commonEnvConfig,
  id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
  name: 'Smart Zap View',
  production,
  prototypeMode: false,
  pagesMode: false,
  appBaseHref: '/',
  enableServiceWorker: true,
  enableUpdates: true,
  enableMonitoring: true,
  link: {
    help: '#',
    xls: '#',
    myaccount: '#',
  },
  keycloakConfig,
  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.pushManager.api,
  ],
  apps,
  routeHome: 'courses',
  coreModuleConfig,
  workspacesPageLogo: 'assets/branding/smartzap-double-check.svg',
  featureFlags,
};
