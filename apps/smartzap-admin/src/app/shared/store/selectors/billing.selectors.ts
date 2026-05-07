import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBilling from '../reducers/billing.reducer';

export const selectBillingRouterState = createFeatureSelector<fromBilling.State>(fromBilling.featureKey);

export const selectGetBilling = createSelector(selectBillingRouterState, (state) => state);

export const selectGetAvailableBalance = createSelector(selectBillingRouterState, (state) => state.availableZaps);
