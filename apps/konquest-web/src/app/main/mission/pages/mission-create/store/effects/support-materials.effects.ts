import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupportMaterialsCreateService } from '../../../../services/support-materials-create.service';
import { MissionServiceV2 } from '../../../../services/mission.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MissionActions, MissionSelectors, SupportMaterialActions } from 'app/main/mission/pages/mission-create/store';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, EMPTY, mergeMap, of, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class SupportMaterialsEffects {
  loadSupportMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionActions.loadMission),
      switchMap(({ missionId }) =>
        this.missionService.fetchSupportMaterials(missionId).pipe(
          map((supportMaterials) => SupportMaterialActions.loadSupportMaterialsSuccess({ supportMaterials })),
          catchError((error) => of(SupportMaterialActions.loadSupportMaterialsFailure({ error }))),
        ),
      ),
    );
  });

  uploadSupportMaterial$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SupportMaterialActions.uploadSupportMaterial),
        concatLatestFrom(() => [this.store.select(MissionSelectors.selectMissionId)]),
        mergeMap(([{ files }, eventId]) => {
          for (const file of files) {
            this.supportMaterialsCreateService.createUpload(file, eventId);
          }
          return EMPTY;
        }),
      );
    },
    { dispatch: false },
  );

  clearAllUploads$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MissionActions.resetStore),
        map(() => {
          this.supportMaterialsCreateService.clearAllUploads();
        }),
      );
    },
    { dispatch: false },
  );

  deleteSupportMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SupportMaterialActions.deleteSupportMaterial),
      switchMap(({ id }) =>
        this.supportMaterialsCreateService.openDeleteConfirmDialog().pipe(
          filter((result) => !!result),
          switchMap(() =>
            this.missionService.deleteSupportMaterial(id).pipe(
              map(() => SupportMaterialActions.deleteSupportMaterialSuccess({ id })),
              catchError((error) => of(SupportMaterialActions.deleteSupportMaterialFailure({ error }))),
            ),
          ),
        ),
      ),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly supportMaterialsCreateService: SupportMaterialsCreateService,
    private readonly missionService: MissionServiceV2,
  ) {}
}
