import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpLinebreak',
  standalone: true,
})
export class KpLinebreakPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return;
    }

    return value.replace(/(\r\n|\n|\r)/gm, '<br>');
  }
}
