import { InjectionToken } from '@angular/core';

export type Kpi18nConfig = {
  availableLangs?: string[];
  defaultLang?: string;
  prodMode?: boolean;
  reRenderOnLangChange?: boolean;
  cacheVersion?: string;
};

export const DEFAULT_I18N_CONFIG: Kpi18nConfig = {
  availableLangs: ['en', 'es', 'pt-BR', 'pt-PT'],
  defaultLang: 'pt-BR',
  reRenderOnLangChange: true,
};

export const KP_I18N_CONFIG = new InjectionToken<Kpi18nConfig>('kp-i18n-config');
