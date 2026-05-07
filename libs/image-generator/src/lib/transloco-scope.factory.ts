import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';

const loader: InlineLoader = ['en', 'es', 'pt-BR', 'pt-PT'].reduce((acc, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {} as InlineLoader);

export function getTranslocoScope() {
  return provideTranslocoScope({
    scope: 'image-wizard',
    alias: 'IMAGE_WIZARD',
    loader,
  });
}
