import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpPerformance',
  standalone: true,
})
export class KpPerformancePipe implements PipeTransform {
  transform(value?: number, symbol?: string): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (!value || value < 0) {
      return symbol ? `0${symbol}` : '0';
    }

    if (value > 1) {
      return symbol ? `100${symbol}` : '100';
    }

    return symbol ? `${(value * 100).toFixed()}${symbol}` : (value * 100).toString();
  }
}
