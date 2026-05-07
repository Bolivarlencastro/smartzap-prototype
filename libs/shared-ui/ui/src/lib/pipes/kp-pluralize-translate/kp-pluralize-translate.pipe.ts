import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'kpPluralizeTranslate',
  standalone: true,
})
export class KpPluralizeTranslatePipe implements PipeTransform {
  constructor(private _translateService: TranslocoService) {}

  transform(value: string, ...args: Record<string, number | undefined | null>[]): string {
    const pluralize = args[0]['value'] === 1 ? 'SINGULAR' : 'PLURAL';
    const textToTranslate = `${value}.${pluralize}`;
    return this._translateService.translate(textToTranslate, args[0]);
  }
}
