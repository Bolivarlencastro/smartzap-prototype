import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpQuizCharcode',
  standalone: true,
})
export class KpQuizCharcodePipe implements PipeTransform {
  transform(value: number): string | undefined {
    if (!value) {
      return undefined;
    }
    return String.fromCharCode(value);
  }
}
