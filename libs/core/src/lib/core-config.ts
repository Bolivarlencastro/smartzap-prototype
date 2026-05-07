import { InjectionToken } from '@angular/core';

export const CORE_CONFIG = new InjectionToken<CoreConfig>('kp-core-config');

export interface CoreConfig {
  apis: {
    apiKonquestUrl: string;
    apiRegulatoryComplianceURL?: string;
    apiMyAccountV2Url?: string;
    apiLearnAnalyticsUrl?: string;
    apiAluraIntegration?: string;
    apiKontentUrl?: string;
    certificateManager?: string;
    smartzapPortal?: string;
    apiSisyphusUrl?: string;
    apiChatbotAnalytics?: string;
    apiCustomSectionsUrl?: string;
    apiImageGeneratorUrl?: string;
    apiPushManagerUrl?: string;
    apiSmartzapAdminUrl?: string;
    apiSearchUrl?: string;
  };
  appId: string;
  production: boolean;
  applicationsApiBasePath?: string;
}
