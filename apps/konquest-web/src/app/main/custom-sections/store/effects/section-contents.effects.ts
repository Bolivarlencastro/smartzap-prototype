import { Injectable } from '@angular/core';
import { categoriesFeature } from '@app/shared/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { SectionContentsService } from '../../services/section-contents.service';
import { SectionContentsActions } from '../actions';
import { sectionContentsFeature } from '../features/section-contents.feature';

@Injectable()
export class SectionContentsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly sectionContentsService: SectionContentsService,
    private readonly store: Store,
  ) {}

  loadData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentsActions.loadData),
      concatLatestFrom(() => [
        this.store.select(sectionContentsFeature.selectLearningObjectType),
        this.store.select(sectionContentsFeature.selectActiveTab),
        this.store.select(sectionContentsFeature.selectSearch),
        this.store.select(categoriesFeature.selectMissionsFiltered),
      ]),
      switchMap(([_, learningObjectType, activeTab, search, categories]) =>
        this.sectionContentsService
          .getData(learningObjectType, activeTab, search, categories)
          .pipe(map((items) => SectionContentsActions.setData({ items }))),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentsActions.init, SectionContentsActions.setSearch, SectionContentsActions.setTab),
      map(() => SectionContentsActions.loadData()),
    );
  });

  save$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentsActions.save),
      concatLatestFrom(() => this.store.select(sectionContentsFeature.selectActiveTab)),
      switchMap(([{ ids, section }, activeTab]) =>
        this.sectionContentsService.editSectionContents(ids, section, activeTab).pipe(
          map(() => SectionContentsActions.saveSuccess({ message: 'CUSTOM_SECTIONS.ACTIONS.CREATE_CONTENT_SUCCESS' })),
          catchError(() =>
            of(SectionContentsActions.saveFailure({ message: 'CUSTOM_SECTIONS.ACTIONS.CREATE_CONTENT_FAILURE' })),
          ),
        ),
      ),
    );
  });
}
