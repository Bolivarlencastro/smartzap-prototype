import { ActionReducerMap } from '@ngrx/store';

import * as fromRouter from './router.reducer';

export interface State {
  [fromRouter.featureKey]: fromRouter.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromRouter.featureKey]: fromRouter.reducer,
};
