import { Pipe, PipeTransform } from '@angular/core';
import { podiumColors } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'podiumBorder',
  standalone: true,
})
export class PodiumBorderPipe implements PipeTransform {
  transform(position: number, isMobile: boolean): string {
    const result = podiumColors.get(position);

    if (isMobile) {
      return `3px solid ${result || '#D3D3D3'}`;
    }

    return result ? `3px solid ${result}` : 'none';
  }
}
