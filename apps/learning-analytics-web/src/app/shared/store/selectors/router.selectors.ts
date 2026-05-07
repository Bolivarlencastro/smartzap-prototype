import { getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '../reducers/router.reducer';

export const selectRouterState = createFeatureSelector<fromRouter.State>(fromRouter.featureKey);

export const {
  selectCurrentRoute, // select the current route
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getRouterSelectors(selectRouterState);
