import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpDocsUrl',
  standalone: true,
})
export class KpDocsUrlPipe implements PipeTransform {
  transform(value: string): unknown {
    if (!value) {
      return value;
    }

    const googleRegex = /http(s)?:\/\/(docs|drive)\.google\.com/;
    if (googleRegex.exec(value)) {
      return value + '/preview';
    }

    const keepsRegex = /(https?:\/\/)?(www\.)?(\/.*)?keepsdev\.com/;
    if (keepsRegex.exec(value)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${value}`;
    }

    return value;
  }
}
