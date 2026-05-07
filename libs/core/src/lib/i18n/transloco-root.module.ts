import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { inject, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { DEFAULT_I18N_CONFIG, KP_I18N_CONFIG, Kpi18nConfig } from './kp-i18n-config';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: TranslocoRootModule.config.availableLangs,
        defaultLang: TranslocoRootModule.config.defaultLang,
        reRenderOnLangChange: TranslocoRootModule.config.reRenderOnLangChange,
        prodMode: TranslocoRootModule.config.prodMode,
        missingHandler: {
          logMissingKey: false,
        },
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat(),
  ],
})
export class TranslocoRootModule {
  static config: Kpi18nConfig = DEFAULT_I18N_CONFIG;

  constructor() {
    const config: Kpi18nConfig = inject(KP_I18N_CONFIG);
    TranslocoRootModule.config = { ...DEFAULT_I18N_CONFIG, ...config };
  }
}
