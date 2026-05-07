import { Injectable } from '@angular/core';
import { UserService } from '@core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ContributorService } from 'app/main/mission/services/contributors.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionActions, MissionContributorsActions } from '../actions';
import { MissionSelectors } from '../selectors';

@Injectable()
export class ContributorsEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _missionContributorsService: ContributorService,
    private _usersService: UserService,
  ) {}

  loadMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionSuccess),
      map(({ mission }) =>
        MissionContributorsActions.loadContributors({
          missionId: mission.id,
        }),
      ),
    );
  });

  addContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContributorsActions.addContributor),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      switchMap(([{ contributor }, missionId]) =>
        this._missionContributorsService.addContributors(missionId, contributor.id).pipe(
          map((contributor) => MissionContributorsActions.addContributorSuccess({ contributor })),
          catchError((error) => of(MissionContributorsActions.addContributorFailure({ error }))),
        ),
      ),
    );
  });

  removeContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContributorsActions.removeContributor),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      switchMap(([{ userId }, missionId]) =>
        this._missionContributorsService.deleteContributors(missionId, userId).pipe(
          map(() => MissionContributorsActions.removeContributorSuccess({ userId })),
          catchError((error) => of(MissionContributorsActions.removeContributorFailure({ error }))),
        ),
      ),
    );
  });

  loadContributor$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContributorsActions.loadContributors),
      switchMap(({ missionId }) =>
        this._missionContributorsService.getContributors(missionId).pipe(
          map(({ results }) => MissionContributorsActions.loadContributorsSuccess({ contributors: results })),
          catchError((error) => of(MissionContributorsActions.loadContributorsFailure({ error }))),
        ),
      ),
    );
  });

  filterUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContributorsActions.filterUsers),
      switchMap(({ filter }) =>
        this._usersService.fetchByQuery({ search: filter, limit: 25 }).pipe(
          map(({ data }) => MissionContributorsActions.filterUsersSuccess({ users: data })),
          catchError((error) => of(MissionContributorsActions.filterUsersFailure({ error }))),
        ),
      ),
    );
  });
}
