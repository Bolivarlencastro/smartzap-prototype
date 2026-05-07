import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Mission } from 'app/main/mission/mission.model';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { MissionDetailService } from '../../services/mission-detail.service';
import { MissionDetailActions } from '../actions';
import { MissionDetailSelectors } from '../selectors';

@Injectable()
export class MissionDetailEffects {
  openDetailDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MissionDetailActions.openMissionDetails),
        map(() => this._missionDetailService.openDialog()),
      );
    },
    { dispatch: false },
  );

  openDetailDialogFromContainer$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MissionDetailActions.openMissionDetailsFromContainer),
        map(() => this._missionDetailService.openDialog()),
      );
    },
    { dispatch: false },
  );

  closeDetailDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MissionDetailActions.closeMissionDetails),
        map(() => this._missionDetailService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  loadMission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.openMissionDetails, MissionDetailActions.openMissionDetailsFromContainer),
      switchMap(({ missionId }) =>
        this._missionDetailService.loadMission(missionId).pipe(
          map((mission: Mission) => MissionDetailService.buildExtraMissionAttributes(mission)),
          map((mission) => MissionDetailActions.loadMissionSuccess({ mission })),
          catchError((error) => of(MissionDetailActions.loadMissionFailure({ error }))),
        ),
      ),
    );
  });

  reLoadMission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.reloadMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionId)),
      filter(([_, missionId]) => !!missionId),
      switchMap(([_, missionId]) =>
        this._missionDetailService.loadMission(missionId).pipe(
          map((mission: Mission) => MissionDetailService.buildExtraMissionAttributes(mission)),
          map((mission) => MissionDetailActions.loadMissionSuccess({ mission })),
          catchError((error) => of(MissionDetailActions.reloadMissionFailure({ error }))),
        ),
      ),
    );
  });

  loadMissionFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.loadMissionFailure),
      map(() => MissionDetailActions.closeMissionDetails()),
    );
  });

  dialogDestroyed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.dialogDestroy),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectRollbackTrailId)),
      tap(([_, rollbackTrailId]) => this._missionDetailService.onDialogDestroyed(rollbackTrailId)),
      map(() => MissionDetailActions.resetState()),
    );
  });

  updateMissionSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.updateMissionSummary),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionId)),
      switchMap(([{ summary }, missionId]) =>
        this._missionDetailService.updateSummary(summary, missionId).pipe(
          map(() => MissionDetailActions.updateMissionSummarySuccess({ summary })),
          catchError(() => of(MissionDetailActions.updateMissionSummaryFailure())),
        ),
      ),
    );
  });

  updateLiveMissionSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.updateLiveMissionSummary),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionId)),
      switchMap(([{ description }, missionId]) =>
        this._missionDetailService.updateLiveMissionSumary(description, missionId).pipe(
          map(() => MissionDetailActions.updateLiveMissionSummarySuccess({ description })),
          catchError(() => of(MissionDetailActions.updateLiveMissionSummaryFailure())),
        ),
      ),
    );
  });

  createTags$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.createTags),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionId)),
      switchMap(([{ tags }, missionId]) =>
        this._missionDetailService.createTags(missionId, tags).pipe(
          map((result) => MissionDetailActions.createTagsSuccess({ tags: result })),
          catchError(() => of(MissionDetailActions.createTagsFailure())),
        ),
      ),
    );
  });

  removeTag$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.removeTag),
      switchMap(({ tagId }) =>
        this._missionDetailService.removeTag(tagId).pipe(
          map(() => MissionDetailActions.removeTagSuccess({ tagId })),
          catchError(() => of(MissionDetailActions.removeTagFailure())),
        ),
      ),
    );
  });

  fetchSupportMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionDetailActions.loadMissionSuccess),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionId)),
      switchMap(([_, id]) =>
        this._missionDetailService
          .fetchSupportMaterials(id)
          .pipe(map((supportMaterials) => MissionDetailActions.setSupportMaterials({ supportMaterials }))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private _missionDetailService: MissionDetailService,
  ) {}
}
