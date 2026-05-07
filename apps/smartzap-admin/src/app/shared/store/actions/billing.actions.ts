import { createAction, props } from '@ngrx/store';
import { Billing } from '../../model';

export const loadBilling = createAction('[Billing] Load Billing', props<{ workspaceId: string }>());

export const loadBillingFailure = createAction('[Billing] Load Billing Failure', props<{ error: Error }>());

export const loadBillingSuccess = createAction('[Billing] Load Billing Success', props<{ billing: Billing }>());
