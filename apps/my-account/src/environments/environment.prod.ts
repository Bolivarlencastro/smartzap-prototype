import { CoreConfig, apps, commonEnvConfig } from '@keeps-platform-frontend-workspace/kp-keeps';

const production = true;

const keycloakConfig = {
  url: 'https://iam.keepsdev.com/auth',
  realm: 'keeps',
  clientId: 'myaccount-frontend',
};

const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiSisyphusUrl: apps.sisyphus.api,
  },
  appId: apps.myAccount.id,
  applicationsApiBasePath: '/workspaces',
  production,
};

export const environment = {
  ...commonEnvConfig,
  name: 'MyAccount',
  production,
  roleAccountAdmin: '3b16b975-0297-4edf-950b-e3700b0d0d01',
  roleWorkspaceAdmin: '77e3a833-94b5-4c37-891d-988513eabb67',
  roleKeepsAdmin: 'e67234f4-957b-483d-badc-2fbcd6cd4173',
  keepsMenu: [{ link: 'https://konquest.keepsdev.com', icon: 'konquest' }],
  domain: 'keepsdev.com',
  keycloakConfig,

  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.sisyphus.api,
  ],
  routeHome: 'user/profile',
  apps,
  coreModuleConfig: coreModuleConfig,
  workspacesPageLogo: 'https://assets.keepsdev.com/images/logos/myaccount-branco.png',
};
