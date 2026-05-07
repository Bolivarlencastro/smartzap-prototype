import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trackingPercetangePosition' })
export class TrackingPercetangePositionPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 100) {
      return value > 24 ? `calc(${value}% - 24px)` : `calc(${value}% + 4px)`;
    }

    return `70px`;
  }
}
