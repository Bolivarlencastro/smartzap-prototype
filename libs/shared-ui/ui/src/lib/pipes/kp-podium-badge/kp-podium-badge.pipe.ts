import { Pipe, PipeTransform } from '@angular/core';
import { podiumColors } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'kpPodiumBadge',
  standalone: true,
})
export class KpPodiumBadgePipe implements PipeTransform {
  transform(value: number): string {
    const bgColor = podiumColors.get(value);
    const fontColor = value === 1 ? 'black' : 'white';
    return `background-color: ${bgColor}; color: ${fontColor}`;
  }
}
