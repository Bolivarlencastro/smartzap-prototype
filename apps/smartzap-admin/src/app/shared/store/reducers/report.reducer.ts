import { Action, createReducer } from '@ngrx/store';
import { Report } from '../../model';

export const featureKey = 'report';

export interface State {
  selectedReport: Report | null;
}

export const initialState: State = {
  selectedReport: null,
};

const ReportReducer = createReducer(initialState);

export function reducer(state: State, action: Action) {
  return ReportReducer(state, action);
}
