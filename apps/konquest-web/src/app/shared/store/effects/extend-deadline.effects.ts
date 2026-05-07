import { Injectable } from '@angular/core';
import { MissionDoneActionType } from '@app/main/mission-enrollments/consts';
import { NotificationService } from '@core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { filter, map, switchMap } from 'rxjs/operators';
import * as EnrollmentsActions from '../../../main/mission-enrollments/store/mission-enrollments.actions';
import * as ExtendDeadlineAction from '../actions/extend-deadline.actions';
import { ExtendDeadlineDialogData, ExtendDeadlinePayload } from '@core/model/enrollment.model';

@Injectable()
export class ExtendDeadlineEffects {
  constructor(
    private _actions$: Actions,
    private _missionService: MissionServiceV2,
    private _notificationService: NotificationService,
  ) {}

  openExtendDeadlineDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExtendDeadlineAction.openExtendDeadlineDialog),
      switchMap(({ notification }) => {
        return this._missionService.fetchEnrollmentByMissionId(notification.objectPk).pipe(
          switchMap((enrollment) => {
            const dialogData: ExtendDeadlineDialogData = {
              user: notification.message,
              learningObjectName: enrollment.mission.name,
              startDate: enrollment.start_date,
              currentGoalDate: enrollment.goal_date,
              learnContentType: 'mission',
            };

            return this._notificationService
              .openExtendDeadlineDialog(dialogData)
              .afterClosed()
              .pipe(
                filter((goalDate) => !!goalDate),
                map((goalDate) => {
                  const payload: ExtendDeadlinePayload = {
                    goalDate,
                    userId: enrollment.user.id,
                    enrollmentId: enrollment.id,
                  };

                  return ExtendDeadlineAction.closeExtendDeadlineDialog({ payload });
                }),
              );
          }),
        );
      }),
    );
  });

  closeExtendDeadlineDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ExtendDeadlineAction.closeExtendDeadlineDialog),
      map(({ payload }) => {
        return EnrollmentsActions.executeAction({
          action: MissionDoneActionType.EXTEND_DEADLINE_ADMIN,
          payload: {
            id: payload.enrollmentId,
            userId: payload.userId,
            goalDate: payload.goalDate,
          },
        });
      }),
    );
  });
}
