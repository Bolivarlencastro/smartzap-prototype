import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { MissionLive, MissionModel, MissionPresential } from 'app/main/mission/mission.model';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { selectRouteNestedParam } from 'app/shared/store';
import { concat, of, switchMap } from 'rxjs';
import { catchError, concatMap, filter, map, tap } from 'rxjs/operators';
import { ImageDefinition, MissionCreateService } from '../../services/mission-create.service';
import { MissionActions, MissionStageActions } from '../actions';
import { MissionSelectors, ScormContentSelectors } from '../selectors';
import { CertificateLearnContentFacade } from '@keeps-platform-frontend-workspace/custom-certificates';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class MissionEffects {
  saveCompleteMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.saveCompleteMission),
      concatMap(({ mission, skipNavigation, dates }) => {
        return concat(
          of(MissionActions.saveMission({ mission, skipNavigation })),
          of(MissionActions.saveMissionDates({ dates })),
        );
      }),
    );
  });

  getMissionModelFromRoute$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => [
        this.store.select(selectRouteNestedParam('mission-model-id')),
        this.store.select(MissionSelectors.selectMissionModel),
        this.store.select(MissionSelectors.selectMissionLoaded),
        this.store.select(MissionSelectors.selectMissionId),
      ]),
      map(([_, missionModelOrID, currentMissionModel, missionLoaded, currentId]) => ({
        missionModelOrID,
        currentMissionModel,
        missionLoaded,
        currentId,
      })),
      filter(({ missionModelOrID, currentMissionModel, missionLoaded, currentId }) =>
        MissionCreateService.filterNavigationEvents(missionModelOrID, currentMissionModel, missionLoaded, currentId),
      ),
      map(({ missionModelOrID }) => MissionCreateService.checkMissionModelOrId(missionModelOrID)),
    );
  });

  loadMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMission),
      switchMap(({ missionId }) => {
        return this._missionService.fetchMissionById(missionId).pipe(
          map((mission) => MissionActions.loadMissionSuccess({ mission })),
          catchError((error) => of(MissionActions.loadMissionFailure({ error }))),
        );
      }),
    );
  });

  loadMissionFailure$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionFailure),
      map(() => MissionActions.navigateToMissions()),
    );
  });

  loadMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionSuccess),
      map(({ mission }) => {
        return MissionActions.setMission({ mission, skipNavigation: true });
      }),
    );
  });

  saveMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.saveMission),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionId)),
      map(([{ mission, skipNavigation }, missionId]) => {
        if (missionId) {
          return MissionActions.updateMission({ mission: { ...mission, id: missionId }, skipNavigation });
        }
        return MissionActions.createMission({ mission });
      }),
    );
  });

  createMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.createMission),
      concatLatestFrom(() => [
        this.store.select(MissionSelectors.selectMissionModel),
        this.store.select(ScormContentSelectors.selectScormSteps),
      ]),
      switchMap(([{ mission }, missionModel, scormSteps]) => {
        return this._missionCreateService.createMission(mission, missionModel, scormSteps).pipe(
          map((createdMission) => MissionActions.createMissionSuccess({ mission: { ...createdMission, ...mission } })),
          catchError((error) => of(MissionActions.saveMissionFailure({ error }))),
        );
      }),
    );
  });

  createMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.createMissionSuccess),
      map(({ mission }) => MissionActions.setMissionAfterCreation({ mission })),
    );
  });

  loadScormSteps$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.createMissionSuccess),
      filter(({ mission }) => mission.mission_model === MissionModel.SCORM),
      map(() => MissionStageActions.loadStages()),
    );
  });

  updateMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.updateMission),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMissionModel)),
      switchMap(([{ mission, skipNavigation }, missionModel]) => {
        return this._missionCreateService.updateMission(mission, missionModel).pipe(
          map(({ id, mission_model }) =>
            MissionActions.updateMissionSuccess({ mission: { ...mission, mission_model, id }, skipNavigation }),
          ),
          catchError((error) => of(MissionActions.saveMissionFailure({ error }))),
        );
      }),
    );
  });

  updateMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.updateMissionSuccess),
      map(({ mission, skipNavigation }) => MissionActions.setMission({ mission, skipNavigation })),
    );
  });

  saveMissionDates$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.saveMissionDates),
      concatLatestFrom(() => [
        this.store.select(MissionSelectors.selectMissionModel),
        this.store.select(MissionSelectors.selectMissionId),
      ]),
      switchMap(([{ dates }, missionModel, missionId]) => {
        const filteredDates = MissionCreateService.groupMissionDates(dates);

        return this._missionCreateService.manageMissionDates(filteredDates, missionId, missionModel).pipe(
          map((results) => {
            return MissionActions.setMissionDates({
              dates: [...filteredDates.untouched, ...results.updated, ...results.created],
            });
          }),
          catchError((error) => of(MissionActions.saveMissionDatesFailure({ error }))),
        );
      }),
    );
  });

  setMissionDatesAfterLoad$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.loadMissionSuccess),
      map(({ mission }) => {
        const presentialLiveInfo: MissionLive | MissionPresential = mission[mission?.mission_model?.toLowerCase()];
        const missionDates = presentialLiveInfo?.dates || [];
        return MissionActions.setMissionDates({ dates: missionDates });
      }),
    );
  });

  publishMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.publishMission),
      concatLatestFrom(() => this.store.select(MissionSelectors.selectMission)),
      switchMap(([_, mission]) => {
        return this._missionCreateService.publishMission(mission.id).pipe(
          map(() => MissionActions.publishMissionSuccess({ missionId: mission.id })),
          catchError((error) => of(MissionActions.publishMissionFailure({ error }))),
        );
      }),
    );
  });

  publishMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.publishMissionSuccess),
      map(() => MissionActions.navigateToMission()),
    );
  });

  navigateToMissions$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.navigateToMissions),
        map(() => this._missionCreateService.navigateToMissions()),
      );
    },
    { dispatch: false },
  );

  navigateToMission$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.navigateToMission),
        concatLatestFrom(() => [
          this.store.select(MissionSelectors.selectMissionId),
          this.store.select(MissionSelectors.selectMissionModel),
        ]),
        map(([_, missionId, missionModel]) => this._missionCreateService.navigateToMission(missionId, missionModel)),
      );
    },
    { dispatch: false },
  );

  navigateAfterSaving$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.setMissionAfterCreation, MissionActions.setMission),
        filter(({ skipNavigation }) => !skipNavigation),
        concatLatestFrom(() => [
          this.store.select(MissionSelectors.selectMissionModel),
          this.store.select(MissionSelectors.selectMissionId),
        ]),
        map(([_, missionModel, missionId]) => {
          this._missionCreateService.navigateNextStep(missionId, missionModel);
        }),
      );
    },
    { dispatch: false },
  );

  navigateNextStep$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.nextStep),
        concatLatestFrom(() => [
          this.store.select(MissionSelectors.selectMissionModel),
          this.store.select(MissionSelectors.selectMissionId),
        ]),
        map(([_, missionModel, missionId]) => {
          this._missionCreateService.navigateNextStep(missionId, missionModel);
        }),
      );
    },
    { dispatch: false },
  );

  navigatePreviousStep$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.previousStep),
        concatLatestFrom(() => [
          this.store.select(MissionSelectors.selectMissionModel),
          this.store.select(MissionSelectors.selectMissionId),
        ]),
        map(([_, missionModel, missionId]) => {
          this._missionCreateService.navigatePreviousStep(missionId, missionModel);
        }),
      );
    },
    { dispatch: false },
  );

  loadMissionCertificate$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionActions.loadMissionSuccess),
        filter(() => !this.userProfileService.hasRoles(['content'])),
        tap(({ mission }) => {
          this.certificateLearnContentFacade.loadLearnContentCertificate(mission.id);
        }),
      );
    },
    { dispatch: false },
  );

  openImageGenDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.openImageGenerationDialog),
      switchMap(({ uploadImageType, rootImage }) =>
        this._missionCreateService.openImageGenDialog(uploadImageType, rootImage).pipe(
          filter((result) => !!result),
          map(({ file, rootImage }) => {
            const imageDefinition: ImageDefinition[] =
              uploadImageType === 'banner' ? ['holder_image'] : ['thumb_image', 'vertical_holder_image'];
            return MissionActions.updateMissionImage({
              file,
              definitions: imageDefinition,
              rootImage,
              uploadImageType,
            });
          }),
        ),
      ),
    );
  });

  updateMissionImage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.updateMissionImage),
      switchMap(({ file, definitions }) =>
        this._missionCreateService.uploadMissionImage(file, definitions).pipe(
          map((response) => MissionActions.updateMissionImageSuccess({ images: response })),
          catchError((error) => of(MissionActions.updateMissionImageFailure({ error }))),
        ),
      ),
    );
  });

  updateMissionImageSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.updateMissionImageSuccess),
      map(({ images }) =>
        MissionActions.saveMission({
          mission: MissionCreateService.getMissionWithImagesDefinitions(images),
          skipNavigation: true,
        }),
      ),
    );
  });

  reuseGeneratedImage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionActions.updateMissionImage),
      concatLatestFrom(() => [
        this.store.select(MissionSelectors.selectBannerImage),
        this.store.select(MissionSelectors.selectCardImage),
      ]),
      filter(([{ uploadImageType }, bannerImage, cardImage]) =>
        uploadImageType === 'banner' ? !cardImage : !bannerImage,
      ),
      switchMap(([{ rootImage, uploadImageType }]) => {
        const newUploadImageType = uploadImageType === 'banner' ? 'card' : 'banner';

        return this._missionCreateService.openReuseGeneratedImageDialog(newUploadImageType).pipe(
          filter((result) => !!result),
          map(() => MissionActions.openImageGenerationDialog({ uploadImageType: newUploadImageType, rootImage })),
        );
      }),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly _actions$: Actions,
    private readonly _missionCreateService: MissionCreateService,
    private readonly _missionService: MissionServiceV2,
    private readonly certificateLearnContentFacade: CertificateLearnContentFacade,
    private readonly userProfileService: UserProfileService,
  ) {}
}
