import { Injectable } from '@angular/core';
import { SectionContentActionStrategy } from './section-content-action.strategy';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { AluraIntegrationsApi, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class AccessCourseContentStrategy implements SectionContentActionStrategy {
  constructor(
    private router: Router,
    private readonly aluraIntegrationApi: AluraIntegrationsApi,
    private readonly messageService: KpMessageService,
  ) {}

  execute(contentType: SECTION_CONTENT_TYPE, item: LearnContentCardData): Observable<Action> {
    if (contentType !== SECTION_CONTENT_TYPE.COURSES) {
      console.warn(`It is not possible to access ${contentType} content.`);
      return of(SectionContentItemActions.executeActionNoopResult());
    }

    if (item.externalCourseUrl) {
      return this.navigateToExternalCourse(item);
    }

    return this.navigateToClassroom(item);
  }

  private navigateToClassroom(item: LearnContentCardData) {
    this.router.navigate(['/course', item.contentId]).then();
    return of(SectionContentItemActions.executeActionNoopResult());
  }

  private navigateToExternalCourse(item: LearnContentCardData) {
    if (item.isIntegration) {
      return this.navigateToIntegrationCourse(item);
    }

    KeepsUtils.openUrlInNewTab(item.externalCourseUrl);
    return of(SectionContentItemActions.executeActionNoopResult());
  }

  private navigateToIntegrationCourse(item: LearnContentCardData): Observable<Action> {
    return this.aluraIntegrationApi.getAccessUrlByMissionId(item.contentId).pipe(
      take(1),
      tap({
        next: ({ url }) => KeepsUtils.openUrlInNewTab(url),
        error: () => this.messageService.error(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED')),
      }),
      map(() => SectionContentItemActions.executeActionNoopResult()),
      catchError((error) => of(SectionContentItemActions.executeActionErrorResult({ error }))),
    );
  }
}
