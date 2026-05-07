import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MissionGroupsService } from '../../services/mission-groups.service';
import { MissionActions, MissionGroupsActions } from '../actions';
import { MissionSelectors } from '../selectors';

@Injectable()
export class GroupsEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _missionGroupService: MissionGroupsService,
  ) {}

  loadMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionSuccess),
      map(({ mission }) => MissionGroupsActions.loadGroups({ missionId: mission.id })),
    );
  });

  addGroup$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionGroupsActions.addGroup),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMission)),
      switchMap(([{ group }, mission]) =>
        this._missionGroupService.addGroup(mission.id, group.id).pipe(
          map(() => MissionGroupsActions.addGroupSuccess({ group })),
          catchError((error) => of(MissionGroupsActions.addGroupFailure({ error }))),
        ),
      ),
    );
  });

  removeGroup$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionGroupsActions.removeGroup),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      switchMap(([{ group }, missionId]) =>
        this._missionGroupService.removeGroup(missionId, group.id).pipe(
          map(() => MissionGroupsActions.removeGroupSuccess({ group })),
          catchError((error) => of(MissionGroupsActions.removeGroupFailure({ error }))),
        ),
      ),
    );
  });

  loadGroup$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionGroupsActions.loadGroups),
      switchMap(({ missionId }) =>
        this._missionGroupService.getGroups(missionId).pipe(
          map(({ results }) => MissionGroupsActions.loadGroupsSuccess({ groups: results })),
          catchError((error) => of(MissionGroupsActions.loadGroupsFailure({ error }))),
        ),
      ),
    );
  });

  filterGroups$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionGroupsActions.filterGroups),
      switchMap(({ filter }) =>
        this._missionGroupService.filterGroups(filter).pipe(
          map(({ results }) => MissionGroupsActions.filterGroupsSuccess({ groups: results })),
          catchError((error) => of(MissionGroupsActions.filterGroupsFailure({ error }))),
        ),
      ),
    );
  });
}
