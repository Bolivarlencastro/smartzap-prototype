import { CoreConfig, apps, commonEnvConfig, FeatureFlags } from '@keeps-platform-frontend-workspace/kp-keeps';

const production = true;

const keycloakConfig = {
  url: 'https://iam.keepsdev.com/auth',
  realm: 'keeps',
  clientId: 'konquest-frontend',
};

const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiRegulatoryComplianceURL: apps.regulatoryCompliance.api,
    apiLearnAnalyticsUrl: apps.learnAnalytics.api,
    apiAluraIntegration: apps.aluraIntegration.api,
    apiKontentUrl: apps.kontent.api,
    certificateManager: apps.certificateManager.api,
    apiSisyphusUrl: apps.sisyphus.api,
    apiCustomSectionsUrl: apps.customSections.api,
    apiImageGeneratorUrl: apps.imageGenerator.api,
    apiSearchUrl: apps.search.api,
  },
  appId: apps.konquest.id,
  production,
};

const featureFlags: FeatureFlags = {
  gamification: true,
  normatives: true,
  'mission-listing-config': true,
  'custom-certificates': true,
  'leader-panel': false,
};

export const environment = {
  ...commonEnvConfig,
  apps,
  name: 'Konquest',
  production,
  domain: 'keepsdev.com',
  keycloakConfig,
  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.aluraIntegration.api,
    apps.certificateManager.api,
    apps.sisyphus.api,
    apps.customSections.api,
    apps.imageGenerator.api,
  ],
  routeHome: 'missions',
  coreModuleConfig,
  integrationsUrls: {
    slack: 'https://learning-platform-api.keepsdev.com/slack/slack/install',
    teams: 'https://teams.microsoft.com/l/app/e7e1b4c6-b31f-4f2f-b82c-9d7daf618c40',
  },
  featureFlags,
  workspacesPageLogo: 'https://assets.keepsdev.com/images/logos/konquest-white.png',
};
