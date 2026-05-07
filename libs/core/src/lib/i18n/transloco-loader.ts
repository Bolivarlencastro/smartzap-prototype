import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { KP_I18N_CONFIG } from './kp-i18n-config';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private i18nConfig = inject(KP_I18N_CONFIG);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`assets/i18n/${lang}.json?versionId=${this.i18nConfig?.cacheVersion}`);
  }
}
