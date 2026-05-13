import { createReducer, on } from '@ngrx/store';
import { Charge } from '../../model';
import { BillingActions } from '../actions';

export const featureKey = 'billing';

export interface State {
  availableZaps: number;
  monthlyPlan: number;
  zapsSent: number;
  charges: Charge[];
  tierName: string | null;
  utility: {
    included: number;
    consumed: number;
    exceeded: number;
    exceededAmount: number;
  } | null;
  marketing: {
    included: number;
    consumed: number;
    exceeded: number;
    exceededAmount: number;
  } | null;
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
  tierName: null,
  utility: null,
  marketing: null,
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
      tier_name,
      utility,
      marketing,
      current_billing: { start_at, end_at },
    } = payload.billing;

    return {
      ...state,
      availableZaps: available_zaps,
      monthlyPlan: monthly_plan,
      zapsSent: zaps_sent,
      charges,
      tierName: tier_name ?? null,
      utility: utility
        ? {
            included: utility.included,
            consumed: utility.consumed,
            exceeded: utility.exceeded,
            exceededAmount: utility.exceeded_amount ?? 0,
          }
        : null,
      marketing: marketing
        ? {
            included: marketing.included,
            consumed: marketing.consumed,
            exceeded: marketing.exceeded,
            exceededAmount: marketing.exceeded_amount ?? 0,
          }
        : null,
      currentBilling: { startAt: start_at, endAt: end_at },
    };
  }),
);
