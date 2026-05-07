import { Pipe, PipeTransform } from '@angular/core';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'kpNumberToTime',
  standalone: true,
})
export class KpNumberToTimePipe implements PipeTransform {
  transform(value: number, from: 'h' | 'm' | 's' = 'h'): string {
    const validValue = !KeepsUtils.isNil(value) && value >= 0;

    if (!validValue) {
      return '0h 00m';
    }

    if (from === 's') {
      value = value / 60;
      value = value / 60;
    } else if (from === 'm') {
      value = value / 60;
    }

    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    const minute_padding = minutes < 10 ? '0' : '';

    return `${hours}h ${minute_padding}${minutes}m`;
  }
}
