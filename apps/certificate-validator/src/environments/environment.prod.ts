import { apps, CoreConfig } from '@keeps-platform-frontend-workspace/kp-keeps';

const production = true;

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
  },
  appId: null,
  production,
};

export const environment = {
  apps,
  name: 'Konquest',
  production,
  domain: 'keepsdev.com',
  coreModuleConfig,
};
