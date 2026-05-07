import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as GroupMissionActions from './group-mission.actions';
import { GroupMissionAPI } from '../group-mission.api';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';

@Injectable()
export class GroupMissionEffects {
  loadGroupMissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupMissionActions.loadGroupMissions, GroupMissionActions.filterGroupMissions),
      switchMap(({ id, queryParams }) =>
        this.service.fetchByQuery(id, queryParams).pipe(
          map((data) => GroupMissionActions.loadGroupMissionsSuccess({ data })),
          catchError((error) => of(GroupMissionActions.loadGroupMissionsFailure({ error }))),
        ),
      ),
    );
  });

  addMany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupMissionActions.addGroupMissions),
      switchMap(({ groupMissionData }) =>
        this.service.addMany(groupMissionData).pipe(
          tap((data) => this._errorHandlerService.showImportEnrollmentsErrorDialog(data)),
          map(() =>
            GroupMissionActions.filterGroupMissions({
              id: groupMissionData.groupId,
              queryParams: { page: 1, per_page: 10 },
            }),
          ),
          catchError((error) => of(GroupMissionActions.loadGroupMissionsFailure({ error }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupMissionActions.deleteGroupMission),
      switchMap(({ groupId, missionId }) =>
        this.service.delete(groupId, missionId).pipe(
          map(() => GroupMissionActions.deleteGroupMissionSuccess()),
          catchError((error) => of(GroupMissionActions.loadGroupMissionsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: GroupMissionAPI,
    private _errorHandlerService: GenericErrorHandlerService,
  ) {}
}
