import { UsersImportDialogViewMode, UsersImportDialogViewModel } from 'app/main/users/users.types';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UsersImportDialogActions } from '../actions';

export interface ImportUsersDialogFeatureState {
  isSaving: boolean;
  viewMode: UsersImportDialogViewMode;
}

export const importUsersDialogFeatureInitialState: ImportUsersDialogFeatureState = {
  isSaving: false,
  viewMode: 'selectFile',
};

const usersImportReducer = createReducer(
  importUsersDialogFeatureInitialState,
  on(UsersImportDialogActions.resetState, (): ImportUsersDialogFeatureState => importUsersDialogFeatureInitialState),

  on(
    UsersImportDialogActions.importFileSelected,
    (state): ImportUsersDialogFeatureState => ({
      ...state,
      viewMode: 'selectRoles',
    }),
  ),
);

export const usersImportDialogFeature = createFeature({
  name: 'usersImportDialog',
  reducer: usersImportReducer,
  extraSelectors: ({ selectUsersImportDialogState }) => ({
    selectViewModel: createSelector(
      selectUsersImportDialogState,
      (state): UsersImportDialogViewModel => ({
        viewMode: state.viewMode,
        isSaving: state.isSaving,
        showTemporaryPasswordToggle: state.viewMode === 'selectRoles',
      }),
    ),
  }),
});
