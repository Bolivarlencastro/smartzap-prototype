import { CoreConfig, apps_stage, commonEnvConfig, FeatureFlags } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KeycloakConfig } from 'keycloak-js';

const production = false;
const apps = apps_stage;

const keycloakConfig: KeycloakConfig = {
  url: 'https://iam.keepsdev.com/auth',
  realm: 'keeps-dev',
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
  'leader-panel': true,
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
    slack: 'https://learning-platform-api-stage.keepsdev.com/slack/slack/install',
    teams: 'https://teams.microsoft.com/l/app/84b03e81-0d92-4221-bd6d-0c3c59b6fe8e',
  },
  featureFlags,
  workspacesPageLogo: 'https://assets.keepsdev.com/images/logos/konquest-white.png',
};
