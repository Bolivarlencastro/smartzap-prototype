import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCategory from './category.reducer';

export const selectCategoryState = createFeatureSelector<fromCategory.State>(fromCategory.categoryFeatureKey);

export const selectAll = createSelector(selectCategoryState, fromCategory.selectAll);

export const selectIsLoading = createSelector(selectCategoryState, (state) => state.isLoading);

export const selectSearch = createSelector(selectCategoryState, (state) => state.search);
