import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'imageUrl' })
export class ImageUrlPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) {
      return 'https://assets.keepsdev.com/images/placeholders/default-card-bg.png';
    }
    return url;
  }
}
