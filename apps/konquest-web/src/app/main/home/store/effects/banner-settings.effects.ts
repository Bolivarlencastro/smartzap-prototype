import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { BannerSettingsService } from '../../services/banner-settings.service';
import { BannersActions, BannerSettingsActions } from '../actions';
import { bannerSettingsFeature } from '../features';

@Injectable()
export class BannerSettingsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly bannerSettingsService: BannerSettingsService,
    private readonly store: Store,
    private readonly messageService: KpMessageService,
  ) {}

  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.openDialog),
      switchMap(() =>
        this.bannerSettingsService
          .openDialog()
          .afterClosed()
          .pipe(map(() => BannerSettingsActions.reset())),
      ),
    );
  });

  loadMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.openDialog),
      switchMap(() =>
        this.bannerSettingsService.loadMode().pipe(
          map((mode) => {
            if (mode === 'RECOMMENDATION') {
              return BannerSettingsActions.setInitialSettings({ data: { mode } });
            }

            return BannerSettingsActions.loadCustomSettings();
          }),
        ),
      ),
    );
  });

  loadCustomSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.loadCustomSettings),
      switchMap(() =>
        this.bannerSettingsService
          .loadCustomSettings()
          .pipe(
            map((customSettings) =>
              BannerSettingsActions.setInitialSettings({ data: { mode: 'MANUAL', customSettings } }),
            ),
          ),
      ),
    );
  });

  setMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.setMode),
      concatLatestFrom(() => this.store.select(bannerSettingsFeature.selectSavedMode)),
      filter(([{ mode }, savedMode]) => savedMode === 'MANUAL' && mode === 'RECOMMENDATION'),
      map((_) => BannerSettingsActions.confirmSaveRecommendationMode()),
    );
  });

  confirmSaveRecommendationMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.confirmSaveRecommendationMode),
      switchMap(() =>
        this.bannerSettingsService.openConfirmRecommendationDialog().pipe(
          map((result) => {
            if (result) {
              return BannerSettingsActions.saveRecommendationMode();
            }

            return BannerSettingsActions.setMode({ mode: 'MANUAL' });
          }),
        ),
      ),
    );
  });

  saveRecommendationMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.saveRecommendationMode),
      switchMap(() =>
        this.bannerSettingsService
          .saveMode('RECOMMENDATION')
          .pipe(map(() => BannerSettingsActions.saveRecommendationModeSuccess())),
      ),
    );
  });

  saveRecommendationModeSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannerSettingsActions.saveRecommendationModeSuccess),
        tap(() => this.messageService.success('HOME.BANNER.SETTINGS.RECOMMENDATION_MODE_MESSAGE_SUCCESS')),
      );
    },
    { dispatch: false },
  );

  loadInternalContents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.loadInternalContents),
      switchMap(({ search }) =>
        this.bannerSettingsService
          .loadInternalContents(search)
          .pipe(map((internalContents) => BannerSettingsActions.loadInternalContentsSuccess({ internalContents }))),
      ),
    );
  });

  publish$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.publish),
      switchMap(({ data }) =>
        this.bannerSettingsService.publish(data).pipe(
          map(() => BannerSettingsActions.publishSuccess()),
          catchError(() => of(BannerSettingsActions.publishFailure())),
        ),
      ),
    );
  });

  publishSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannerSettingsActions.publishSuccess),
        switchMap(() =>
          this.bannerSettingsService.saveMode('MANUAL').pipe(
            map(() => {
              this.bannerSettingsService.closeDialog();
              this.messageService.success('HOME.BANNER.SETTINGS.PUBLISH_MESSAGE_SUCCESS');
            }),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  publishFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannerSettingsActions.publishFailure),
        tap(() => this.messageService.error('HOME.BANNER.SETTINGS.PUBLISH_MESSAGE_FAILURE')),
      );
    },
    { dispatch: false },
  );

  close$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BannerSettingsActions.close),
        concatLatestFrom(() => this.store.select(bannerSettingsFeature.selectMode)),
        tap(([{ dirtyForm }, mode]) => this.bannerSettingsService.verifyClose(dirtyForm, mode)),
      );
    },
    { dispatch: false },
  );

  reset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BannerSettingsActions.reset),
      map(() => BannersActions.loadBanners()),
    );
  });
}
