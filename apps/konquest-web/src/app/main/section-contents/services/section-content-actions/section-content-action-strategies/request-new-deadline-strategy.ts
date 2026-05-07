import { Injectable } from '@angular/core';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { map, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { tap } from 'rxjs/operators';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class RequestNewDeadlineStrategy implements SectionContentActionStrategy {
  constructor(
    private readonly courseEnrollmentsApi: MissionEnrollmentsAPI,
    private readonly messageService: KpMessageService,
  ) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    if (contentType === SECTION_CONTENT_TYPE.EVENTS) {
      console.warn(`It is not possible to request a new deadline for ${contentType}.`);
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    return this.courseEnrollmentsApi.requestExtendDeadline(item.enrollmentId).pipe(
      tap({
        next: () => this.messageService.success(marker('ENROLLMENTS.REQUEST_EXTEND_SUCCESS')),
      }),
      map(() => SectionContentItemActions.executeActionNoopResult()),
    );
  }
}
