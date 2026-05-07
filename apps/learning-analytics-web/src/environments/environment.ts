import { CoreConfig, apps_stage, commonEnvConfig } from '@keeps-platform-frontend-workspace/kp-keeps';

const apps = apps_stage;
const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiLearnAnalyticsUrl: apps.learnAnalytics.api,
    apiChatbotAnalytics: apps.chatbotAnalytics.api,
  },
  appId: apps.learnAnalytics.id,
  production: false,
};

export const environment = {
  ...commonEnvConfig,
  name: 'Learning Analytics',
  apps,
  production: false,
  routeHome: 'dashboard',
  keycloakConfig: {
    url: 'https://iam.keepsdev.com/auth',
    realm: 'keeps-dev',
    clientId: 'analytics-frontend',
  },
  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.chatbotAnalytics.api,
  ],
  coreModuleConfig: coreModuleConfig,
  workspacesPageLogo: 'https://assets.keepsdev.com/images/logos/analytics-white.png',
};
