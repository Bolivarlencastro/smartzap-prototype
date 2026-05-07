import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromTransfer from '../reducers/transfer.reducer';

export const selectCollectionState = createSelector(
  fromStore.selectCoursesFeatureState,
  (state: fromStore.CoursesState) => state.transfer,
);

export const selectAll = createSelector(selectCollectionState, fromTransfer.selectAll);

export const selectIsLoading = createSelector(selectCollectionState, (state) => state.isLoading);
