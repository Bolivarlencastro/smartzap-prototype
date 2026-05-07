import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpReplace',
  standalone: true,
})
export class KpReplacePipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    if (!value || !args[0]) {
      return value;
    }

    const from = args[0];
    const to = args[1] || '';

    return value.replace(from, to);
  }
}
