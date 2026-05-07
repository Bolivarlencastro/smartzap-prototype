import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserImportErrorItemDto, UserImportErrorsViewModel } from 'app/main/users/user-import-types';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UserImportErrorsActions } from '../actions';

export interface UserImportErrorsState extends EntityState<UserImportErrorItemDto> {
  isLoading: boolean;
}

export const userImportErrorsAdapter: EntityAdapter<UserImportErrorItemDto> =
  createEntityAdapter<UserImportErrorItemDto>();

export const userImportErrosInitialState: UserImportErrorsState = userImportErrorsAdapter.getInitialState({
  isLoading: true,
});

const reducer = createReducer(
  userImportErrosInitialState,

  on(UserImportErrorsActions.loadUserImportErrorsSuccess, (state, { results }): UserImportErrorsState => {
    return userImportErrorsAdapter.setAll(results, { ...state, isLoading: false });
  }),

  on(UserImportErrorsActions.resetState, (): UserImportErrorsState => userImportErrosInitialState),
);

export const userImportsErrorsFeature = createFeature({
  name: 'userImportsErrors',
  reducer,
  extraSelectors: ({ selectUserImportsErrorsState }) => ({
    selectViewModel: createSelector(
      selectUserImportsErrorsState,
      userImportErrorsAdapter.getSelectors(selectUserImportsErrorsState).selectAll,
      (state, items): UserImportErrorsViewModel => ({ isLoading: state.isLoading, items }),
    ),
  }),
});
