import { apps_stage, commonEnvConfig, CoreConfig } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KeycloakConfig } from 'keycloak-js';

const production = false;
const apps = apps_stage;

const keycloakConfig: KeycloakConfig = {
  url: 'https://iam.keepsdev.com/auth',
  realm: 'keeps-dev',
  clientId: 'checkpoint-frontend',
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
  },
  appId: apps.checkpoint.id,
  production,
};

export const environment = {
  ...commonEnvConfig,
  name: 'Checkpoint',
  apps,
  production,
  domain: 'keepsdev.com',
  keycloakConfig,
  coreModuleConfig,
  bearerUrls: [
    apps.search.api,
    apps.regulatoryCompliance.api,
    apps.notification.api,
    apps.myAccount.apiV2,
    apps.aluraIntegration.api,
    apps.certificateManager.api,
    apps.sisyphus.api,
    apps.customSections.api,
  ],
};
