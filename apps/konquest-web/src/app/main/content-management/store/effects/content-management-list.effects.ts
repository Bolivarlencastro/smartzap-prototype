import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContentManagementListActions } from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { contentManagementListFeature } from '../content-management-list.feature';
import { of } from 'rxjs';
import { CategoriesActions, ProvidersActions } from 'app/shared/store';

@Injectable()
export class ContentManagementListEffects {
  loadLearnContentsByType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentManagementListActions.loadLearnContentsByType),
      map(() => ContentManagementListActions.loadLearnContents()),
    );
  });

  loadLearnContents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ContentManagementListActions.loadLearnContents,
        ContentManagementListActions.setFilter,
        ContentManagementListActions.setPagination,
      ),
      concatLatestFrom(() => [
        this.store.select(contentManagementListFeature.selectContentType),
        this.store.select(contentManagementListFeature.selectFilter),
        this.store.select(contentManagementListFeature.selectForceFilterOnlyManaged).pipe(),
      ]),
      switchMap(([_, contentType, filter, forceFilteringOnlyManaged]) =>
        this.contentManagementService.loadLearnContent(filter, contentType, forceFilteringOnlyManaged).pipe(
          map((result) => ContentManagementListActions.loadLearnContentsSuccess({ result })),
          catchError((error) => of(ContentManagementListActions.loadLearnContentsFailure({ error }))),
        ),
      ),
    );
  });

  loadFilterCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentManagementListActions.loadCoursesFilterData),
      map(() => CategoriesActions.loadAllMissionCategories()),
    );
  });

  loadFilterProviders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentManagementListActions.loadCoursesFilterData),
      map(() => ProvidersActions.loadProviders()),
    );
  });

  loadChannelsFilterCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentManagementListActions.loadChannelsFilterData),
      map(() => CategoriesActions.loadCategories()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly contentManagementService: ContentManagementService,
  ) {}
}
