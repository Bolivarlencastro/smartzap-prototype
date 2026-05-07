import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, pt, ptBR } from 'date-fns/locale';

@Pipe({
  name: 'kpFromNow',
  standalone: true,
})
export class KpFromNowPipe implements PipeTransform {
  transform(value: any, locale: 'pt-BR' | 'en' | 'es' | 'pt-PT' = 'pt-BR'): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const localeMap: Record<string, any> = {
      en: {
        code: enUS,
        suffix: 'ago',
      },
      es: {
        code: es,
        prefix: 'hace',
      },
      'pt-BR': {
        code: ptBR,
        prefix: 'há',
      },
      'pt-PT': {
        code: pt,
        prefix: 'há',
      },
    };

    const formattedString = formatDistanceToNow(date, { locale: localeMap[locale].code });

    return localeMap[locale].prefix
      ? `${localeMap[locale].prefix} ${formattedString}`
      : `${formattedString} ${localeMap[locale].suffix}`;
  }
}
