import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CategoriesActions, ProvidersActions } from 'app/shared/store';
import { map, of, switchMap } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { SectionContentsService } from '../../services/section-contents.service';
import { SectionContentActions } from '../actions';
import { sectionContentsFeature } from '../section-contents.feature';
import { selectIsAdmin, selectIsSuperAdmin } from '@app/shared/store/selectors/user-profile.selectors';

@Injectable()
export class SectionContentsEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.init),
      switchMap(({ sectionId }) =>
        this.sectionContentsService
          .getInitialConfig(sectionId)
          .pipe(map(({ contentType, section }) => SectionContentActions.setInitialConfig({ contentType, section }))),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.setInitialConfig, SectionContentActions.filter),
      map(() => SectionContentActions.loadSectionContents()),
    );
  });

  loadSectionContents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.loadSectionContents),
      concatLatestFrom(() => [
        this.store.select(sectionContentsFeature.selectSection),
        this.store.select(sectionContentsFeature.selectContentType),
        this.store.select(sectionContentsFeature.selectFilter),
        this.store.select(selectIsSuperAdmin),
        this.store.select(selectIsAdmin),
      ]),
      switchMap(([_, section, contentType, filter, isSuperAdmin, isAdmin]) =>
        this.sectionContentsService.loadSectionContents(section, contentType, filter, isSuperAdmin, isAdmin).pipe(
          map((result) => SectionContentActions.loadSectionContentsSuccess({ result })),
          catchError(() => of(SectionContentActions.loadSectionContentsFailure())),
        ),
      ),
    );
  });

  loadMoreSectionContents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.loadMoreSectionContents),
      concatLatestFrom(() => [
        this.store.select(sectionContentsFeature.selectFinished),
        this.store.select(sectionContentsFeature.selectSection),
        this.store.select(sectionContentsFeature.selectContentType),
        this.store.select(sectionContentsFeature.selectFilter),
        this.store.select(selectIsSuperAdmin),
        this.store.select(selectIsAdmin),
      ]),
      filter(([_, finished]) => !finished),
      switchMap(([_, _finished, section, contentType, filter, isSuperAdmin, isAdmin]) =>
        this.sectionContentsService.loadSectionContents(section, contentType, filter, isSuperAdmin, isAdmin).pipe(
          map((result) => SectionContentActions.loadMoreSectionContentsSuccess({ result })),
          catchError(() => of(SectionContentActions.loadMoreSectionContentsFailure())),
        ),
      ),
    );
  });

  loadFilterCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.init),
      map(() => CategoriesActions.loadAllMissionCategories()),
    );
  });

  loadFilterProviders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentActions.init),
      map(() => ProvidersActions.loadProviders()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly sectionContentsService: SectionContentsService,
  ) {}
}
