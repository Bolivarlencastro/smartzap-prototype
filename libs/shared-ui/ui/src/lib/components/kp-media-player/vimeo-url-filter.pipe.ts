import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vimeoUrlFilter',
  standalone: true,
})
export class VimeoUrlFilterPipe implements PipeTransform {
  transform(url: string): string {
    if (url?.includes('vimeo.com')) {
      return url.replace('?share=copy', '');
    }
    return url;
  }
}
