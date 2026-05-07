import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import * as ptBR from '../../assets/i18n/pt-BR.json';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { ptBR },
    translocoConfig: {
      availableLangs: ['pt-BR'],
      defaultLang: 'pt-BR',
    },
    preloadLangs: true,
    ...options,
  });
}
