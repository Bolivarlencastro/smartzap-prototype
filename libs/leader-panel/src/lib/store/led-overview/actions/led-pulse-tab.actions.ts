import { createAction, props } from '@ngrx/store';
import { LedPulseItem } from '../../../models/led-pulse-item';

const fetchPulses = createAction('[Led Pulse Tab] Fetch Pulses');

const fetchPulsesSuccess = createAction('[Led Pulse Tab] Fetch Pulses Success', props<{ pulses: LedPulseItem[] }>());

const fetchPulsesFailure = createAction('[Led Pulse Tab] Fetch Pulses Failure');

export const LedPulseTabActions = {
  fetchPulses,
  fetchPulsesSuccess,
  fetchPulsesFailure,
};
