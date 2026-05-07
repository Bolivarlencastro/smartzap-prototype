import { CoreConfig, apps, commonEnvConfig } from '@keeps-platform-frontend-workspace/kp-keeps';

const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiLearnAnalyticsUrl: apps.learnAnalytics.api,
    apiChatbotAnalytics: apps.chatbotAnalytics.api,
  },
  appId: apps.learnAnalytics.id,
  production: true,
};

export const environment = {
  ...commonEnvConfig,
  name: 'Learning Analytics',
  apps,
  production: true,
  routeHome: 'dashboard',
  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.chatbotAnalytics.api,
  ],
  keycloakConfig: {
    url: 'https://iam.keepsdev.com/auth',
    realm: 'keeps',
    clientId: 'analytics-frontend',
  },
  coreModuleConfig: coreModuleConfig,
  workspacesPageLogo: 'https://assets.keepsdev.com/images/logos/analytics-white.png',
};
