import { createAction, props } from '@ngrx/store';
import { Category } from '@core/model/category.model';

// Load Actions

export const loadCategories = createAction('[Category/API] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Category/API] Load Categories Success',
  props<{ categories: Category[] }>(),
);

export const loadCategoriesFailure = createAction('[Category/API] Load Category Failure', props<{ error: Error }>());

// Add Actions
export const addCategory = createAction('[Category/API] Add Category', props<{ data: any }>());

export const addCategorySuccess = createAction('[Category/API] Add Category Success');

export const addCategoryFailure = createAction('[Category/API] Add Category Failure', props<{ error: Error }>());

// Update Actions
export const updateCategory = createAction('[Category/API] Update Category', props<{ id: string; data: any }>());

export const updateCategorySuccess = createAction('[Category/API]] Update Category Success');

export const updateCategoryFailure = createAction('[Category/API] Update Category Failure', props<{ error: Error }>());

// Delete Actions
export const deleteCategory = createAction('[Category/API] Delete Category', props<{ id: string }>());

export const deleteCategorySuccess = createAction('[Category/API] Delete Category Success', props<{ id: string }>());

export const deleteCategoryFailure = createAction('[Category/API] Delete Category Failure', props<{ error: Error }>());

// Clear Actions
export const clearCache = createAction('[Category] Clear Category Cache');

export const updateFilter = createAction('[Category/API] Update Filter', props<{ search: string }>());
