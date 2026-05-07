import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './category.actions';
import { Category } from '@core/model/category.model';

export const categoryFeatureKey = 'categoryCache';

export interface State extends EntityState<Category> {
  isLoading: boolean;
  search: string;
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  search: '',
});

const categoryReducer = createReducer(
  initialState,

  on(fromActions.deleteCategorySuccess, (state, action): State => adapter.removeOne(action.id, state)),
  on(
    fromActions.loadCategories,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    fromActions.loadCategoriesSuccess,
    (state, action): State => adapter.setAll(action.categories, { ...state, isLoading: false }),
  ),
  on(
    fromActions.loadCategoriesFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(fromActions.addCategory, fromActions.updateCategory, (state): State => ({ ...state, search: '' })),

  on(fromActions.updateFilter, (state, { search }): State => ({ ...state, search })),

  on(fromActions.clearCache, (): State => ({ ...initialState })),
);

export function reducer(state: State | undefined, action: Action): any {
  return categoryReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
