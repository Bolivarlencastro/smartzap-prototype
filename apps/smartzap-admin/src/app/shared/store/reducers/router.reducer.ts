import {
  DEFAULT_ROUTER_FEATURENAME,
  MinimalRouterStateSnapshot,
  routerReducer as reducer,
  RouterReducerState,
} from '@ngrx/router-store';

export const featureKey = DEFAULT_ROUTER_FEATURENAME;

export type State = RouterReducerState<MinimalRouterStateSnapshot>;

export { reducer };
