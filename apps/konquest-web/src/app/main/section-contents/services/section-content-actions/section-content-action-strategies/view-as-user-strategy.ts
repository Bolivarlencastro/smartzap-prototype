import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SectionContentItemActions } from '../../../store/actions';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

@Injectable()
export class ViewAsUserStrategy implements SectionContentActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData) {
    if (contentType !== SECTION_CONTENT_TYPE.COURSES) {
      console.warn(`It is not possible to view ${contentType} as a user.`);
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    this.router.navigate(['/course', item.contentId]).then();
    return of(SectionContentItemActions.executeActionNoopResult());
  }
}
