import { Injectable } from '@angular/core';
import { ManagementActionStrategy } from './management-action.strategy';
import { ContentManagementListActions } from '../../../store/actions';
import { MatDialog } from '@angular/material/dialog';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { LearnContentManagementType } from '../../../models/learn-content-list-filter';
import { Observable, of } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { LearnContentListItem } from '../../../models/learn-content-list-item';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { ChannelAPI } from 'app/main/channel/channel.api';

@Injectable()
export class DeleteContentStrategy implements ManagementActionStrategy {
  constructor(
    private readonly dialog: MatDialog,
    private readonly missionService: MissionServiceV2,
    private readonly learningTrailApi: LearningTrailAPI,
    private readonly channelApi: ChannelAPI,
  ) {}

  execute(contentType: LearnContentManagementType, item: LearnContentListItem) {
    switch (contentType) {
      case 'courses':
        return this.deleteCourse(item);
      case 'events':
        return this.deleteEvent(item);
      case 'trails':
        return this.deleteLearningTrail(item);
      case 'channels':
        return this.deleteChannel(item);
      default:
        console.warn(`It is not possible to delete ${contentType}.`);
        return of(ContentManagementListActions.executeActionNoopResult());
    }
  }

  private deleteCourse(item: LearnContentListItem): Observable<Action> {
    const isIntegration = item.meta['isIntegration'];
    const title = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_COURSE.TITLE');
    const message = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_COURSE.MESSAGE');

    return this.openConfirmationDialog(title, message).pipe(
      filter((value) => value === true),
      switchMap(() => {
        return this.missionService.removeMission(item.id, isIntegration).pipe(
          map(() => ContentManagementListActions.removeItemActionResult({ id: item.id })),
          catchError((error) => of(ContentManagementListActions.executeActionErrorResult({ error }))),
        );
      }),
    );
  }

  private deleteEvent(item: LearnContentListItem): Observable<Action> {
    const title = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_EVENT.TITLE');
    const message = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_EVENT.MESSAGE');

    return this.openConfirmationDialog(title, message).pipe(
      filter((value) => value === true),
      switchMap(() => {
        return this.missionService.removeMission(item.id).pipe(
          map(() => ContentManagementListActions.removeItemActionResult({ id: item.id })),
          catchError((error) => of(ContentManagementListActions.executeActionErrorResult({ error }))),
        );
      }),
    );
  }

  private deleteLearningTrail(item: LearnContentListItem): Observable<Action> {
    const title = marker('LEARNING_TRAIL.DETAIL.REMOVE_TRAIL_TITLE');
    const message = marker('LEARNING_TRAIL.DETAIL.REMOVE_TRAIL_MESSAGE');

    return this.openConfirmationDialog(title, message).pipe(
      filter((value) => value === true),
      switchMap(() => {
        return this.learningTrailApi.deleteLearningTrail(item.id).pipe(
          map(() => ContentManagementListActions.removeItemActionResult({ id: item.id })),
          catchError((error) => of(ContentManagementListActions.executeActionErrorResult({ error }))),
        );
      }),
    );
  }

  private deleteChannel(item: LearnContentListItem): Observable<Action> {
    const title = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_CHANNEL.TITLE');
    const message = marker('CONTENT_MANAGEMENT.MESSAGES.DELETE_CHANNEL.MESSAGE');

    return this.openConfirmationDialog(title, message).pipe(
      filter((value) => value === true),
      switchMap(() => {
        return this.channelApi.deleteChannel(item.id).pipe(
          map(() => ContentManagementListActions.removeItemActionResult({ id: item.id })),
          catchError((error) => of(ContentManagementListActions.executeActionErrorResult({ error }))),
        );
      }),
    );
  }

  private openConfirmationDialog(title: string, message: string): Observable<boolean> {
    const dialogRefConfirm = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRefConfirm.componentInstance.confirmTitle = title;
    dialogRefConfirm.componentInstance.confirmMessage = message;
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    return dialogRefConfirm.afterClosed();
  }
}
