import { ActionReducerMap } from '@ngrx/store';
import * as fromUI from './ui.reducer';
import * as fromRouter from './router.reducer';
import * as fromBilling from './billing.reducer';

export interface State {
  [fromRouter.featureKey]: fromRouter.State;
  [fromUI.featureKey]: fromUI.State;
  [fromBilling.featureKey]: fromBilling.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromRouter.featureKey]: fromRouter.reducer,
  [fromUI.featureKey]: fromUI.UIReducer,
  [fromBilling.featureKey]: fromBilling.BillingReducer,
};
