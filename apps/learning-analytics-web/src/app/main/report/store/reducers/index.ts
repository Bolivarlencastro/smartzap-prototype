import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromLatestReports from './latest-report.reducers';
import * as fromSimpleReportsFilter from './simple-filter-report.reducer';
import * as fromUsersFilterList from './users-filter-list.reducer';
import * as fromCoursesFilterList from './courses-filter-list.reducer';
import * as fromChannelsFilterList from './channels-filter-list.reducer';
import * as fromRoot from 'app/shared/store/reducers';

export const featureKey = 'reports';

export interface ReportsState {
  [fromLatestReports.featureKey]: fromLatestReports.State;
  [fromSimpleReportsFilter.featureKey]: fromSimpleReportsFilter.State;
  [fromUsersFilterList.featureKey]: fromUsersFilterList.State;
  [fromCoursesFilterList.featureKey]: fromCoursesFilterList.State;
  [fromChannelsFilterList.featureKey]: fromChannelsFilterList.State;
}

export interface State extends fromRoot.State {
  [featureKey]: fromRoot.State;
}

export function reducers(state: ReportsState | undefined, action: Action) {
  return combineReducers({
    [fromLatestReports.featureKey]: fromLatestReports.reducer,
    [fromSimpleReportsFilter.featureKey]: fromSimpleReportsFilter.reducer,
    [fromUsersFilterList.featureKey]: fromUsersFilterList.reducer,
    [fromCoursesFilterList.featureKey]: fromCoursesFilterList.reducer,
    [fromChannelsFilterList.featureKey]: fromChannelsFilterList.reducer,
  })(state, action);
}

export const selectReportsState = createFeatureSelector<ReportsState>(featureKey);
