import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reportDuration' })
export class ReportDuration implements PipeTransform {
  transform(value: number): string {
    if (!value) value = 0;

    value = value / 60;
    const minutes = Math.floor(value);
    const seconds = Math.round((value - minutes) * 60);
    const seconds_padding = seconds < 10 ? '0' : '';
    return `${minutes}m ${seconds_padding}${seconds}s`;
  }
}
