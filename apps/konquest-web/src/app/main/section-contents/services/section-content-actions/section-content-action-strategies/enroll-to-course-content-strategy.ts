import { Injectable } from '@angular/core';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from '../../../models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { catchError, map, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SectionContentItemActions } from '../../../store/actions';
import { SectionContentItemEvent } from '../../../models/section-content-item-event';

@Injectable()
export class EnrollToCourseContentStrategy implements SectionContentActionStrategy {
  constructor(
    private readonly authService: AuthService,
    private readonly missionService: MissionServiceV2,
  ) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    if (contentType !== SECTION_CONTENT_TYPE.COURSES) {
      console.warn(`It is not possible to enroll to ${contentType} content.`);
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    return this.missionService.enroll(item.contentId, this.authService.userId).pipe(
      map(() => {
        const event: SectionContentItemEvent = { item, contentType, action: 'start' };
        return SectionContentItemActions.executeAction({ event });
      }),
      catchError((error) => of(SectionContentItemActions.executeActionErrorResult({ error }))),
    );
  }
}
