import { createAction, props } from '@ngrx/store';
import { LedOverviewTabModel } from '../../../models/led-overview-tab';

const fetchData = createAction('[Led Overview Tab] Fetch Data');
const fetchDataSuccess = createAction('[Led Overview Tab] Fetch Data Success', props<{ data: LedOverviewTabModel }>());
const fetchDataFailure = createAction('[Led Overview Tab] Fetch Data Failure');

export const LedOverviewTabActions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
};
