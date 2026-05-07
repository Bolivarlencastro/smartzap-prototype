import { ErrorHandler, ModuleWithProviders, NgModule, inject, provideAppInitializer } from '@angular/core';
import { ApmErrorHandler, ApmModule, ApmService } from '@elastic/apm-rum-angular';
import { commonEnvConfig } from '../environment';

export type KpMonitoringConfig = { prod: boolean; appName: string };

// Regex matching any keepsdev domain, excluding the IAM (keycloak)
const TRACE_ORIGIN_REGEX =
  /^(?!https?:\/\/(?:[^/]+\.)?iam\.keepsdev\.com)(https?:\/\/)?([^/]+\.)?keepsdev\.com(\/.*)?$/;

function initializeApmService(apmService: ApmService, config: KpMonitoringConfig) {
  if (config.prod) {
    apmService.init({
      serviceName: config.appName,
      serverUrl: commonEnvConfig.apmServerUrl,
      environment: config.prod ? 'production' : 'stage',
      propagateTracestate: true,
      distributedTracingOrigins: [TRACE_ORIGIN_REGEX],
      transactionSampleRate: 0.2,
    });
  }
}

@NgModule({
  imports: [ApmModule],
})
export class KpMonitoringModule {
  static forRoot(config: KpMonitoringConfig): ModuleWithProviders<KpMonitoringModule> {
    return {
      ngModule: KpMonitoringModule,
      providers: [
        ApmService,
        provideAppInitializer(() => {
          const initializerFn = (
            (apmService: ApmService) => () =>
              initializeApmService(apmService, config)
          )(inject(ApmService));
          return initializerFn();
        }),
        { provide: ErrorHandler, useClass: ApmErrorHandler },
      ],
    };
  }
}
