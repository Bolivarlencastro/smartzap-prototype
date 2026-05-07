import { Injectable } from '@angular/core';
import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { selectRouteNestedParam } from '@app/shared/store';
import { CertificateLearnContentFacade } from '@keeps-platform-frontend-workspace/custom-certificates';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LearningTrailImageType } from '../../containers/learning-trail-images/learning-trail-images.component';
import { LearningTrailService } from '../../services/learning-trail.service';
import { LearningTrailCreateActions } from '../actions';
import { learningTrailCreateFeature } from '../features/learning-trail-create.feature';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TrailsSearchService } from 'app/main/mission/services/trails-search.service';

@Injectable()
export class LearningTrailCreateEffects {
  saveLearningTrail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.saveLearningTrail),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      mergeMap(([{ learningTrail, skipNavigation }, learningTrailId]) => {
        return this.learningTrailService.saveLearningTrail({ ...learningTrail, id: learningTrailId }).pipe(
          map(({ id }) => {
            const learnTrailWithId: Partial<LearningTrail> = { ...learningTrail, id };
            return LearningTrailCreateActions.saveLearningTrailSuccess({
              learningTrail: learnTrailWithId,
              firstSave: !learningTrailId,
              skipNavigation,
            });
          }),
          catchError((error) => of(LearningTrailCreateActions.saveLearningTrailFailure({ error }))),
        );
      }),
    );
  });

  getLearningTrailFromRoute$ = createEffect(() => {
    return this.actions.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => [
        this.store.select(selectRouteNestedParam('learning-trail-id')),
        this.store.select(learningTrailCreateFeature.selectLearningTrailId),
      ]),
      map(([_, learningTrailId, currentLearningTrailId]) => ({
        learningTrailId,
        currentLearningTrailId,
      })),
      filter(({ learningTrailId, currentLearningTrailId }) =>
        LearningTrailService.filterNavigationEvents(learningTrailId, currentLearningTrailId),
      ),
      map(({ learningTrailId }) => LearningTrailService.checkLearningTrailId(learningTrailId)),
    );
  });

  loadLearningTrail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.loadLearningTrail),
      mergeMap(({ id }) => {
        return this.learningTrailService.getLearningTrailById(id).pipe(
          map((learningTrail) => LearningTrailCreateActions.loadLearningTrailSuccess({ learningTrail })),
          catchError((error) => of(LearningTrailCreateActions.loadLearningTrailFailure(error))),
        );
      }),
    );
  });

  updateLearningTrailWithImage$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.updateTrailImageSuccess),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      switchMap(([{ url, imageType }, id]) => {
        const trail = { id, [imageType]: url } as unknown as LearningTrail;
        return this.learningTrailService.saveLearningTrail(trail).pipe(
          map((response) =>
            LearningTrailCreateActions.updateLearningTrailWithImageSuccess({ learningTrail: response }),
          ),
          catchError((error) => of(LearningTrailCreateActions.updateLearningTrailFailure({ error }))),
        );
      }),
    );
  });

  navigateAferSaving$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearningTrailCreateActions.saveLearningTrailSuccess),
        concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
        filter(([{ skipNavigation }, _]) => !skipNavigation),
        map(([learningTrail]) => {
          this.learningTrailService.navigateNextStep(learningTrail.learningTrail.id);
        }),
      );
    },
    { dispatch: false },
  );

  navigateNextStep$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearningTrailCreateActions.nextStep),
        concatLatestFrom(() => [this.store.select(learningTrailCreateFeature.selectLearningTrailId)]),
        map(([_, learningTrailId]) => {
          this.learningTrailService.navigateNextStep(learningTrailId);
        }),
      );
    },
    { dispatch: false },
  );

  navigatePreviousStep$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearningTrailCreateActions.previousStep),
        concatLatestFrom(() => [this.store.select(learningTrailCreateFeature.selectLearningTrailId)]),
        map(([_, learningTrailId]) => {
          this.learningTrailService.navigatePreviousStep(learningTrailId);
        }),
      );
    },
    { dispatch: false },
  );

  updateTrailImage$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.updateTrailImage),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      switchMap(([{ file, imageType }]) =>
        this.learningTrailService.uploadLearningTrailImage(file, imageType).pipe(
          map((response) => LearningTrailCreateActions.updateTrailImageSuccess({ url: response.url, imageType })),
          catchError((error) => of(LearningTrailCreateActions.updateTrailImageFailure({ error }))),
        ),
      ),
    );
  });

  getLearningTrailContents$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.loadContents),
      switchMap(({ search }) => {
        return this.trailsSearchService.fetchTrailsContents(search).pipe(
          map((response) =>
            LearningTrailCreateActions.loadContentsSuccess({
              contents: response.items,
            }),
          ),
          catchError((error) => of(LearningTrailCreateActions.loadContentsFailure({ error }))),
        );
      }),
    );
  });

  postLearningTrailContent$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.postLearningTrailContent),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      switchMap(([{ mission, pulse, order }, learning_trail]) =>
        this.learningTrailService.postLearningTrailContent({ learning_trail, mission, pulse, order }).pipe(
          map((response) => {
            return LearningTrailCreateActions.postLearningTrailContentSuccess({
              learningTrailId: learning_trail,
              content: response,
            });
          }),
          catchError((error) => {
            return of(LearningTrailCreateActions.postLearningTrailContentFailure({ error }));
          }),
        ),
      ),
    );
  });

  postLearningTrailContentSuccess$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.postLearningTrailContentSuccess),
      map(({ learningTrailId }) =>
        LearningTrailCreateActions.loadLearningTrail({
          id: learningTrailId,
        }),
      ),
    );
  });

  loadLearningTrailSuccess$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.loadLearningTrailSuccess),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectContents)),
      filter(([_, contents]) => !contents?.length),
      map(() => LearningTrailCreateActions.loadContents({ search: '' })),
    );
  });

  initialContentLoadAfterSave$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.saveLearningTrailSuccess),
      filter(({ firstSave }) => firstSave),
      map(() => LearningTrailCreateActions.loadContents({ search: '' })),
    );
  });

  updateLearningTrailContent$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.updateLearningTrailContent),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),

      switchMap(([{ steps }, trailId]) =>
        this.learningTrailService.reorderLearningTrailContent(trailId, steps).pipe(
          map((content) => LearningTrailCreateActions.updateLearningTrailContentSuccess({ content })),
          catchError((error) => of(LearningTrailCreateActions.updateLearningTrailFailure({ error }))),
        ),
      ),
    );
  });

  deleteLearningTrailContent$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.deleteLearningTrailContent),
      switchMap(({ learningTrailId, id }) =>
        this.learningTrailService.deleteLearningTrailContent(id).pipe(
          map((response: any) =>
            LearningTrailCreateActions.deleteLearningTrailContentSuccess({
              learningTrailId,
              payload: response,
            }),
          ),
          catchError((error) => of(LearningTrailCreateActions.deleteLearningTrailContentFailure({ error }))),
        ),
      ),
    );
  });

  deleteLearningTrailContentSuccess$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.deleteLearningTrailContentSuccess),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      map(([_, learningTrailId]) => {
        return LearningTrailCreateActions.loadLearningTrail({ id: learningTrailId });
      }),
    );
  });

  updateLearningTrailContentSuccess$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.updateLearningTrailContentSuccess),
      concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
      map(([_, learningTrailId]) => {
        return LearningTrailCreateActions.loadLearningTrail({ id: learningTrailId });
      }),
    );
  });

  loadTrailCertificate$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearningTrailCreateActions.loadLearningTrailSuccess),
        filter(() => !this.userProfileService.hasRoles(['content'])),
        tap(({ learningTrail }) => {
          this.certificateLearnContentFacade.loadLearnContentCertificate(learningTrail.id);
        }),
      );
    },
    { dispatch: false },
  );

  navigateToPublishedTrail$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearningTrailCreateActions.navigateToTrail),
        concatLatestFrom(() => this.store.select(learningTrailCreateFeature.selectLearningTrailId)),
        map(([, learningTrailId]) => {
          this.learningTrailService.navigateToTrail(learningTrailId);
        }),
      );
    },
    { dispatch: false },
  );

  openImageGenDialog$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.openImageGenerationDialog),
      switchMap(({ uploadImageType, rootImage }) =>
        this.learningTrailService.openImageGenDialog(uploadImageType, rootImage).pipe(
          filter((result) => !!result),
          map(({ file, rootImage }) => {
            const imageType: LearningTrailImageType = uploadImageType === 'banner' ? 'holder_image' : 'thumb_image';
            return LearningTrailCreateActions.updateTrailImage({
              file,
              imageType,
              rootImage,
              uploadImageType,
            });
          }),
        ),
      ),
    );
  });

  reuseGeneratedImage$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearningTrailCreateActions.updateTrailImage),
      concatLatestFrom(() => [
        this.store.select(learningTrailCreateFeature.selectLearningTrailHolderImage),
        this.store.select(learningTrailCreateFeature.selectLearningTrailThumbImage),
      ]),
      filter(([{ uploadImageType }, bannerImage, cardImage]) =>
        uploadImageType === 'banner' ? !cardImage : !bannerImage,
      ),
      switchMap(([{ rootImage, uploadImageType }]) => {
        const newUploadImageType = uploadImageType === 'banner' ? 'card' : 'banner';

        return this.learningTrailService.openReuseGeneratedImageDialog(newUploadImageType).pipe(
          filter((result) => !!result),
          map(() =>
            LearningTrailCreateActions.openImageGenerationDialog({ uploadImageType: newUploadImageType, rootImage }),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly learningTrailService: LearningTrailService,
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly certificateLearnContentFacade: CertificateLearnContentFacade,
    private readonly userProfileService: UserProfileService,
    private readonly trailsSearchService: TrailsSearchService,
  ) {}
}
