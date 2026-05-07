import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserImportItemDto, UserImportViewModel } from 'app/main/users/user-import-types';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UserImportsActions } from '../actions';

export interface UserImportsState extends EntityState<UserImportItemDto> {
  isLoading: boolean;
}

export const userImportsAdapter: EntityAdapter<UserImportItemDto> = createEntityAdapter<UserImportItemDto>();

export const userImportsInitialState: UserImportsState = userImportsAdapter.getInitialState({ isLoading: true });

const reducer = createReducer(
  userImportsInitialState,
  on(UserImportsActions.loadUserImportsSuccess, (state, { results }): UserImportsState => {
    return userImportsAdapter.setAll(results, { ...state, isLoading: false });
  }),

  on(UserImportsActions.resetState, (): UserImportsState => userImportsInitialState),
);

export const userImportsFeature = createFeature({
  name: 'userImports',
  reducer,
  extraSelectors: ({ selectUserImportsState }) => ({
    selectViewModel: createSelector(
      selectUserImportsState,
      userImportsAdapter.getSelectors(selectUserImportsState).selectAll,
      (state, items): UserImportViewModel => ({ isLoading: state.isLoading, items }),
    ),
  }),
});
