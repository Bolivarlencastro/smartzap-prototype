import { createAction, props } from '@ngrx/store';
import { PanelData } from '../../models/panel';

const loadPanelData = createAction('[Push Manager - Panel] Load Panel Data');
const loadPanelDataSuccess = createAction(
  '[Push Manager - Panel] Load Panel Data Success',
  props<{ data: PanelData }>(),
);
const loadPanelDataFailure = createAction('[Push Manager - Panel] Load Panel Data Failure');

const removePush = createAction('[Push Manager - Panel] Remove Push', props<{ id: string }>());

export const PanelActions = {
  loadPanelData,
  loadPanelDataSuccess,
  loadPanelDataFailure,
  removePush,
};
