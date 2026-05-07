import { Injectable } from '@angular/core';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { navigateToEvent, navigateToMission, navigateToTrail } from 'app/shared/services';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';

@Injectable()
export class OpenContentDetailsStrategy implements SectionContentActionStrategy {
  constructor(private readonly router: Router) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    switch (contentType) {
      case SECTION_CONTENT_TYPE.COURSES:
        navigateToMission(this.router, item.contentId).then();
        break;
      case SECTION_CONTENT_TYPE.EVENTS:
        navigateToEvent(this.router, item.contentId).then();
        break;
      case SECTION_CONTENT_TYPE.TRAILS:
        navigateToTrail(this.router, item.contentId).then();
        break;
      default:
        console.warn(`It is not possible to open ${contentType} details.`);
    }

    return of(SectionContentItemActions.executeActionNoopResult());
  }
}
