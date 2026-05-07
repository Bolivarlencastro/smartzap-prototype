import { apps, CoreConfig } from '@keeps-platform-frontend-workspace/kp-keeps';

const production = true;

const coreModuleConfig: CoreConfig = {
  apis: {
    apiMyAccountV2Url: apps.myAccount.apiV2,
    apiKonquestUrl: apps.konquest.api,
    apiRegulatoryComplianceURL: apps.regulatoryCompliance.api,
    apiLearnAnalyticsUrl: apps.learnAnalytics.api,
    apiAluraIntegration: apps.aluraIntegration.api,
    smartzapPortal: apps.smartzapPortal.api,
  },
  appId: apps.konquest.id,
  production,
};

export const environment = {
  production,
  coreModuleConfig,
};
