import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpDuration',
  standalone: true,
})
export class KpDurationPipe implements PipeTransform {
  transform(value: any, args: any = { secLabel: 's', minLabel: 'min', hourLabel: 'h' }): string {
    if (!value) {
      return '--:--';
    }

    const seconds = Math.floor(+value);

    if (seconds < 60) {
      return `${seconds} ${args.secLabel}`;
    }

    if (seconds < 3600) {
      const minutes = this.toMinutes(seconds);
      return `${minutes} ${args.minLabel}`;
    }

    const minutes = this.toMinutes(seconds);
    const hours = Math.floor(seconds / 3600);
    return hours + ` ${args.hourLabel} ` + minutes + ` ${args.minLabel}`;
  }

  private toMinutes(seconds: number) {
    return Math.floor(((seconds % 3600) / 3600) * 60);
  }
}
