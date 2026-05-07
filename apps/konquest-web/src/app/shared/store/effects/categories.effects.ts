import { Injectable } from '@angular/core';
import * as CategoryManagement from '@app/main/category/categories/store/category.actions';
import { CategoriesService } from '@app/shared/services/categories.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CategoriesActions, GlobalSettingsActions } from '../actions';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { categoriesFeature } from '../features';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class CategoriesEffects {
  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        GlobalSettingsActions.init,
        CategoriesActions.loadCategories,
        CategoryManagement.addCategorySuccess,
        CategoryManagement.updateCategorySuccess,
        CategoryManagement.deleteCategorySuccess,
      ),
      switchMap(() =>
        this.categoriesService
          .getCategories()
          .pipe(
            map(({ missionsFiltered, channels }) =>
              CategoriesActions.loadCategoriesSuccess({ missionsFiltered, channels }),
            ),
          ),
      ),
    );
  });

  loadAllMissionCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategoriesActions.loadAllMissionCategories),
      concatLatestFrom(() => this.store.select(categoriesFeature.selectMissions)),
      switchMap(([_, missions]) => {
        if (missions.length > 0) {
          return of(CategoriesActions.loadAllMissionCategoriesSuccess({ missions }));
        }
        return this.categoriesService.getAllMissionCategories().pipe(
          map((missions) => CategoriesActions.loadAllMissionCategoriesSuccess({ missions })),
          catchError((error) => of(CategoriesActions.loadAllMissionCategoriesFailure({ error }))),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService,
    private store: Store,
  ) {}
}
