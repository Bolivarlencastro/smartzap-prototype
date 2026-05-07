import {
  InlineLoader,
  provideTranslocoScope,
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import * as ptBR from '../assets/i18n/pt-BR.json';

const loader: InlineLoader = ['en', 'es', 'pt-BR', 'pt-PT'].reduce((acc, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {} as InlineLoader);

export function getTranslocoScope() {
  return provideTranslocoScope({
    scope: 'classroom',
    alias: 'CLASSROOM',
    loader,
  });
}

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
