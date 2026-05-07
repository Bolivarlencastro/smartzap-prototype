import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'kpSafeUrl',
  standalone: true,
})
export class KpSafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): any {
    if (!value) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
