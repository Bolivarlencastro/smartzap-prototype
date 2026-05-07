import { createSelector } from '@ngrx/store';
import { CoursesState, selectCoursesFeatureState } from '../reducers';
import * as fromLanguages from '../reducers/upload.reducer';

export const selectDetailState = createSelector(selectCoursesFeatureState, (state: CoursesState) => state.upload);

export const selectGetSelectedImage = createSelector(
  selectDetailState,
  (state: fromLanguages.State) => state.selectedImage,
);

export const selectIsLoadingImage = createSelector(selectDetailState, (state: fromLanguages.State) => state.isLoading);
