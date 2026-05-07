import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChannel from './channel.reducer';
import * as fromLearningTrail from './learning-trail.reducer';
import * as fromMission from './mission.reducer';
import * as fromUser from './user.reducer';
import * as fromUserProfileReducer from './user-profile.reducer';
import * as fromNotification from './notification.reducer';
export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State {
  routerState: fromRouter.RouterReducerState<RouterStateUrl>;
  [fromUser.featureKey]: fromUser.State;
  [fromMission.featureKey]: fromMission.State;
  [fromLearningTrail.featureKey]: fromLearningTrail.State;
  [fromChannel.featureKey]: fromChannel.State;
  [fromUserProfileReducer.userProfileFeatureKey]: fromUserProfileReducer.UserProfileState;
  [fromNotification.featureKey]: fromNotification.State;
}

export const reducers: ActionReducerMap<State> = {
  routerState: fromRouter.routerReducer,
  userCache: fromUser.reducer,
  learningTrailCache: fromLearningTrail.reducer,
  missionCache: fromMission.reducer,
  channelCache: fromChannel.reducer,
  [fromUserProfileReducer.userProfileFeatureKey]: fromUserProfileReducer.userProfileReducer,
  [fromNotification.featureKey]: fromNotification.reducer,
};

export const selectRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerState');

@Injectable()
export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return {
      url,
      queryParams,
      params,
    };
  }
}

export const selectRouter = createFeatureSelector<RouterReducerState>('routerState');

const selectRouteNestedParams = createSelector(selectRouter, (router) => {
  let currentRoute = router?.state?.root;
  let params: Params = {};
  while (currentRoute?.firstChild) {
    currentRoute = currentRoute.firstChild;
    params = {
      ...params,
      ...currentRoute.params,
    };
  }
  return params;
});

export const selectRouteNestedParam = (param: string) =>
  createSelector(selectRouteNestedParams, (params) => params?.[param]);
