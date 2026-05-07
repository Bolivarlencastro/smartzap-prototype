import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpNoHtml',
  standalone: true,
})
export class KpNoHtmlPipe implements PipeTransform {
  readonly replaceRegex = /<\/?[^>]+(>|$)|&nbsp;/g;

  transform(value: string): string {
    return value?.replace(this.replaceRegex, '') || '';
  }
}
