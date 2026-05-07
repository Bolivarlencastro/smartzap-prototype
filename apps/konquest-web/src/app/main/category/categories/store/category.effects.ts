import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { CategoryService } from '../category.service';
import * as fromActions from './category.actions';
import * as fromSelectors from './category.selectors';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class CategoryEffects {
  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loadCategories),
      concatLatestFrom(() => [this.store.select(fromSelectors.selectSearch)]),
      switchMap(([_, search]) =>
        this.service.fetchByQuery({ search }).pipe(
          map((categories) => fromActions.loadCategoriesSuccess({ categories })),
          catchError((error) => of(fromActions.loadCategoriesFailure({ error }))),
        ),
      ),
    );
  });

  addCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addCategory),
      switchMap(({ data }) =>
        this.service.create(data).pipe(
          map(() => fromActions.addCategorySuccess()),
          catchError((error) => of(fromActions.addCategoryFailure({ error }))),
        ),
      ),
    );
  });

  updateCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateCategory),
      switchMap(({ id, data }) =>
        this.service.update(id, data).pipe(
          map(() => fromActions.updateCategorySuccess()),
          catchError((error) => of(fromActions.updateCategoryFailure({ error }))),
        ),
      ),
    );
  });

  addOrUpdateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addCategorySuccess, fromActions.updateCategorySuccess),
      map(() => fromActions.loadCategories()),
    );
  });

  deleteCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.deleteCategory),
      switchMap(({ id }) =>
        this.service.deleteOne(id).pipe(
          map(() => fromActions.deleteCategorySuccess({ id })),
          catchError((error) => of(fromActions.deleteCategoryFailure({ error }))),
        ),
      ),
    );
  });

  updateFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateFilter),
      map(() => fromActions.loadCategories()),
    );
  });

  constructor(
    private actions$: Actions,
    private service: CategoryService,
    private store: Store,
  ) {}
}
