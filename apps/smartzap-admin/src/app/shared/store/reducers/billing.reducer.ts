import { createReducer, on } from '@ngrx/store';
import { Charge } from '../../model';
import { BillingActions } from '../actions';

export const featureKey = 'billing';

export interface State {
  availableZaps: number;
  monthlyPlan: number;
  zapsSent: number;
  charges: Charge[];
  currentBilling: {
    startAt: string | null;
    endAt: string | null;
  };
}

export const initialState: State = {
  availableZaps: 0,
  monthlyPlan: 0,
  zapsSent: 0,
  charges: [],
  currentBilling: { startAt: null, endAt: null },
};

export const BillingReducer = createReducer(
  initialState,

  on(BillingActions.loadBillingSuccess, (state, payload): State => {
    const {
      available_zaps,
      monthly_plan,
      zaps_sent,
      charges,
      current_billing: { start_at, end_at },
    } = payload.billing;

    return {
      ...state,
      availableZaps: available_zaps,
      monthlyPlan: monthly_plan,
      zapsSent: zaps_sent,
      charges,
      currentBilling: { startAt: start_at, endAt: end_at },
    };
  }),
);
