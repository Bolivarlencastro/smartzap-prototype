import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromTracking from '../reducers/tracking.reducer';

export const selectCollectionState = createSelector(
  fromStore.selectCoursesFeatureState,
  (state: fromStore.CoursesState) => state.tracking,
);

export const selectAll = createSelector(selectCollectionState, fromTracking.selectAll);

export const selectIsLoading = createSelector(selectCollectionState, (state) => state.isLoading);
