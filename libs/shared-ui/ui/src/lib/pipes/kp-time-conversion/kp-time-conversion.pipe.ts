import { inject, Pipe, PipeTransform } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoService } from '@jsverse/transloco';

const HOURS_LABEL = marker('UI.TIME_CONVERSION_PIPE.HOURS');
const MINUTES_LABEL = marker('UI.TIME_CONVERSION_PIPE.MINUTES');
const SECONDS_LABEL = marker('UI.TIME_CONVERSION_PIPE.SECONDS');

@Pipe({
  name: 'kpTimeConversion',
  standalone: true,
})
export class KpTimeConversionPipe implements PipeTransform {
  private translocoService = inject(TranslocoService);

  transform(value: number): string {
    if (isNaN(value) || value < 0) {
      return '';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    if (hours > 0) {
      return this.translocoService.translate(HOURS_LABEL, { value: hours });
    }

    if (minutes > 0) {
      return this.translocoService.translate(MINUTES_LABEL, { value: minutes });
    }

    return this.translocoService.translate(SECONDS_LABEL, { value: seconds });
  }
}
