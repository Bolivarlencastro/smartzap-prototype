import { Pipe, PipeTransform } from '@angular/core';
import { Mission } from '../../components/kp-mission-model/model';
import { LearningTrail } from '../../components/kp-learning-trail-detail-steps/model';

@Pipe({
  name: 'kpPopupBgImage',
  standalone: true,
})
export class KpPopupBgImagePipe implements PipeTransform {
  transform(item: Mission | LearningTrail, type: 'mission' | 'learning-trail'): string {
    const missionDefaultBg = 'https://assets.keepsdev.com/images/placeholders/default-card-bg.png';
    const learningTrailDefaultBg = 'assets/images/trail-background.png';
    return `url(${item?.holder_image || (type === 'mission' ? missionDefaultBg : learningTrailDefaultBg)})`;
  }
}
