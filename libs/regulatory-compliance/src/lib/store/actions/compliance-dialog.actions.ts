import { createAction, props } from '@ngrx/store';
import { ComplianceListItem } from '../../models';
import { Update } from '@ngrx/entity';
import { ComplianceDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openDialog = createAction('[Compliance Dialog] Open Dialog');

export const loadComplianceSuccess = createAction(
  '[Compliance Dialog] Load Compliance Success',
  props<{ results: ComplianceListItem[]; totalItems: number; isFinished: boolean }>(),
);

export const loadComplianceFailure = createAction('[Compliance Dialog] Load Compliance Failure');

export const loadMoreItems = createAction('[Compliance Dialog] Load More Items');

export const loadMoreItemsSuccess = createAction(
  '[Compliance Dialog] Load More Items Success',
  props<{ results: ComplianceListItem[]; totalItems: number; isFinished: boolean }>(),
);

export const filterCompliance = createAction('[Compliance Dialog] Filter Compliance', props<{ filter: string }>());

export const saveCompliance = createAction(
  '[Compliance Dialog] Save Compliance',
  props<{
    compliance: ComplianceDto;
  }>(),
);

export const addCompliance = createAction('[Compliance Dialog] Add Compliance', props<{ name: string }>());

export const addComplianceSuccess = createAction(
  '[Compliance Dialog] Add Compliance Success',
  props<{ compliance: ComplianceListItem }>(),
);

export const addComplianceFailure = createAction('[Compliance Dialog] Add Compliance Failure');

export const editCompliance = createAction(
  '[Compliance Dialog] Edit Compliance',
  props<{
    compliance: ComplianceDto;
  }>(),
);

export const editComplianceSuccess = createAction(
  '[Compliance Dialog] Edit Compliance Success',
  props<{ payload: Update<ComplianceListItem> }>(),
);

export const editComplianceFailure = createAction('[Compliance Dialog] Edit Compliance Failure');

export const deleteCompliance = createAction('[Compliance Dialog] Delete Compliance', props<{ id: string }>());

export const deleteComplianceSuccess = createAction(
  '[Compliance Dialog] Delete Compliance Success',
  props<{ id: string }>(),
);

export const deleteComplianceFailure = createAction('[Compliance Dialog] Delete Compliance Failure');

export const toggleSelectCompliance = createAction(
  '[Compliance Dialog] Toggle Compliance Selection',
  props<{ id: string; selected: boolean }>(),
);

export const toggleSelectAllCompliance = createAction(
  '[Compliance Dialog] Toggle Select All',
  props<{ selected: boolean }>(),
);

export const updateAllItemsSelection = createAction(
  '[Compliance Dialog] Toggle Update All Items Selection',
  props<{ selected: boolean; payload: Update<ComplianceListItem>[] }>(),
);

export const batchDeleteCompliance = createAction('[Compliance Dialog] Batch Delete');

export const batchDeleteSuccess = createAction('[Compliance Dialog] Batch Delete Success');

export const reset = createAction('[Compliance Dialog] Reset state');
