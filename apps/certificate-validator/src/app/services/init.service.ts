import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class InitService {
  readonly supportedLanguages = ['pt-BR', 'pt-PT', 'en', 'es'];

  constructor(private readonly translocoService: TranslocoService) {}

  async init(): Promise<void> {
    this.setUserLanguage();
  }

  private setUserLanguage(): void {
    const language = this.getUserLanguage();
    this.translocoService.setActiveLang(language);
    this.translocoService.setDefaultLang(language);
  }

  private getUserLanguage(fallback = 'pt-BR') {
    const languages = navigator.languages;

    for (const lang of languages) {
      if (this.supportedLanguages.includes(lang)) {
        return lang;
      }

      const langWithoutRegion = lang.split('-')[0];
      if (this.supportedLanguages.includes(langWithoutRegion)) {
        return langWithoutRegion;
      }
    }

    return fallback;
  }
}
