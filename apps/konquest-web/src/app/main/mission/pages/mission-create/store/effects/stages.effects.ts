import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { ContentUploadService } from '../../services/content-upload.service';
import { MissionCreateService } from '../../services/mission-create.service';
import { MissionActions, MissionContentActions, MissionStageActions } from '../actions';
import { MissionSelectors } from '../selectors';
import { QuizActions } from '@keeps-platform-frontend-workspace/quiz';

@Injectable()
export class StagesEffects {
  constructor(
    private store: Store,
    private _actions$: Actions,
    private _missionService: MissionCreateService,
    private _contentUploadService: ContentUploadService,
  ) {}

  loadMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMission),
      switchMap(({ missionId }) =>
        this._missionService.loadStages(missionId).pipe(
          map((stages) => MissionStageActions.loadStagesSuccess({ stages })),
          catchError((error) => of(MissionStageActions.loadStagesFailure({ error }))),
        ),
      ),
    );
  });

  loadStages$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.loadStages),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      switchMap(([_, id]) =>
        this._missionService.loadStages(id).pipe(
          map((stages) => MissionStageActions.loadStagesSuccess({ stages })),
          catchError((error) => of(MissionStageActions.loadStagesFailure({ error }))),
        ),
      ),
    );
  });

  saveStage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.saveStage),
      switchMap(({ stage, missionId }) =>
        this._missionService.saveStage(stage, missionId).pipe(
          map((response) => MissionStageActions.saveStageSuccess({ stage: response })),
          catchError((error) => of(MissionStageActions.saveStageFailure({ error }))),
        ),
      ),
    );
  });

  editStage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.editStage),
      switchMap(({ stage }) => {
        const { id, name, description } = stage;
        return this._missionService.editStage(stage).pipe(
          map(() => MissionStageActions.editStageSuccess({ payload: { id, changes: { name, description } } })),
          catchError((error) => of(MissionStageActions.editStageFailure({ error }))),
        );
      }),
    );
  });

  removeStage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.removeStage),
      switchMap(({ id }) =>
        this._missionService.removeStage(id).pipe(
          map(() => MissionStageActions.removeStageSuccess({ id })),
          catchError((error) => of(MissionStageActions.removeStageFailure({ error }))),
        ),
      ),
    );
  });

  removeStageSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.removeStageSuccess),
      map(() => MissionStageActions.loadStages()),
    );
  });

  reorderStages$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionStageActions.reorderStages),
      switchMap(({ stages }) =>
        this._missionService.reorderStages(stages).pipe(
          map(() => MissionStageActions.loadStagesSuccess({ stages })),
          catchError((error) => of(MissionStageActions.reorderStagesFailure({ error }))),
        ),
      ),
    );
  });

  reorderStageContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContentActions.reorderStageContent),
      switchMap(({ id, contents }) =>
        this._missionService.reorderStageContents(contents).pipe(
          map(() => MissionStageActions.editStageSuccess({ payload: { id, changes: { contents } } })),
          catchError((error) => of(MissionContentActions.reorderStageContentFailure({ error }))),
        ),
      ),
    );
  });

  editStageContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContentActions.editStageContent),
      switchMap(({ content }) => {
        return this._missionService.editStageContent(content).pipe(
          map(() => MissionContentActions.editStageContentSuccess()),
          catchError((error) => of(MissionStageActions.editStageFailure({ error }))),
        );
      }),
    );
  });

  editStageContentSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContentActions.editStageContentSuccess),
      map(() => MissionStageActions.loadStages()),
    );
  });

  deleteStageContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContentActions.deleteStageContent),
      switchMap(({ id }) =>
        this._missionService.deleteStageContent(id).pipe(
          map(() => MissionStageActions.loadStages()),
          catchError((error) => of(MissionContentActions.deleteStageContentFailure({ error }))),
        ),
      ),
    );
  });

  deleteStageContentSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionContentActions.deleteStageContentSuccess),
      map(() => MissionStageActions.loadStages()),
    );
  });

  createQuizSuccess = createEffect(() => {
    return this._actions$.pipe(
      ofType(QuizActions.createQuizSuccess, QuizActions.updateQuizSuccess),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      filter(([_, missionId]) => !!missionId),
      map(() => MissionStageActions.loadStages()),
    );
  });

  uploadFile$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionContentActions.uploadFile),
        concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
        map(([{ stage, content }, missionId]) => {
          this._contentUploadService.createUpload(stage, missionId, content);
        }),
      );
    },
    { dispatch: false },
  );

  clearAllUploads$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.resetStore),
        map(() => {
          this._contentUploadService.clearAllUploads();
        }),
      );
    },
    { dispatch: false },
  );
}
