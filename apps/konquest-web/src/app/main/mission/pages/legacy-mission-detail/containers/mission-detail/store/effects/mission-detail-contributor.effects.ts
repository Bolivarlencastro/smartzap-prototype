import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@core/api';
import { Pagination } from '@core/model';
import { Contributor } from '@core/model/contributor.model';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContributorService } from 'app/main/mission/services/contributors.service';
import { concat, map, of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { MissionDetailContributorActions } from '../actions';

const DISPLAY_ACTIONS = [
  MissionDetailContributorActions.addMissionContributor,
  MissionDetailContributorActions.deleteMissionContributor,
  MissionDetailContributorActions.getMissionContributor,
  MissionDetailContributorActions.getUsers,
];

const DISMISS_ACTIONS = [
  MissionDetailContributorActions.addMissionContributorSuccess,
  MissionDetailContributorActions.deleteMissionContributorSuccess,
  MissionDetailContributorActions.getMissionContributorSuccess,
  MissionDetailContributorActions.getUsersSuccess,
  MissionDetailContributorActions.addMissionContributorFailure,
  MissionDetailContributorActions.deleteMissionContributorFailure,
  MissionDetailContributorActions.getMissionContributorFailure,
  MissionDetailContributorActions.getUsersFailure,
];

@Injectable()
export class MissionDetailContributorEffects {
  deleteContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionDetailContributorActions.deleteMissionContributor),
      mergeMap(({ mission_id, user_id }) => {
        return this._missionAPI.deleteContributors(mission_id, user_id).pipe(
          mergeMap(() => {
            return concat(
              of(MissionDetailContributorActions.deleteMissionContributorSuccess()),
              of(
                MissionDetailContributorActions.getMissionContributor({
                  mission_id,
                }),
              ),
            );
          }),
          catchError((err) =>
            of(
              MissionDetailContributorActions.deleteMissionContributorFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  addContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionDetailContributorActions.addMissionContributor),
      mergeMap(({ mission_id, user_id }) => {
        return this._missionAPI.addContributors(mission_id, user_id).pipe(
          map(() => {
            return MissionDetailContributorActions.getMissionContributor({
              mission_id,
            });
          }),
          catchError((err) =>
            of(
              MissionDetailContributorActions.addMissionContributorFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  getMissionContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionDetailContributorActions.getMissionContributor),
      switchMap(({ mission_id }) => {
        return this._missionAPI.getContributors(mission_id).pipe(
          map((response: Pagination<Contributor>) =>
            MissionDetailContributorActions.getMissionContributorSuccess({
              contributors: response.results || [],
            }),
          ),
          catchError((err) =>
            of(
              MissionDetailContributorActions.getMissionContributorFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  getUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionDetailContributorActions.getUsers),
      switchMap(({ per_page, search }) => {
        return this._userService.fetchByQuery({ limit: per_page, search }).pipe(
          map((response) =>
            MissionDetailContributorActions.getUsersSuccess({
              users: response.data ?? [],
            }),
          ),
          catchError((err) =>
            of(
              MissionDetailContributorActions.getUsersFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  displayLoading$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(...DISPLAY_ACTIONS),
        tap(() => this._snackBar.openFromComponent(KpSnackLoadingComponent, { horizontalPosition: 'center' })),
      );
    },
    { dispatch: false },
  );

  dismissLoading$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(...DISMISS_ACTIONS),
        tap(() => this._snackBar.dismiss()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private _actions$: Actions,
    private _missionAPI: ContributorService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
  ) {}
}
