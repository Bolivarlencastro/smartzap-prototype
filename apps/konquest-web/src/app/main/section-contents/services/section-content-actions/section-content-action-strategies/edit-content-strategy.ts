import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';

@Injectable()
export class EditContentStrategy implements SectionContentActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData) {
    switch (contentType) {
      case SECTION_CONTENT_TYPE.EVENTS:
        this.redirectToEventsEdition(item.contentId);
        break;
      case SECTION_CONTENT_TYPE.COURSES:
        this.redirectToCourseEdition(item.contentId);
        break;
      case SECTION_CONTENT_TYPE.TRAILS:
        this.redirectToTrailEdition(item.contentId);
        break;
      default:
        console.warn(`It is not possible to edit ${contentType}.`);
    }

    return of(SectionContentItemActions.executeActionNoopResult());
  }

  private redirectToCourseEdition(courseId: string) {
    this.router.navigate(['/missions/create', courseId]).then();
  }

  private redirectToEventsEdition(eventId: string) {
    this.router.navigate(['/events/create', eventId]).then();
  }

  private redirectToTrailEdition(trailId: string) {
    this.router.navigate(['/learning-trails/create', trailId]).then();
  }
}
