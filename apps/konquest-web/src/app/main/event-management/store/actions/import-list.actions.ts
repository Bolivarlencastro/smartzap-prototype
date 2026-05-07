import { ImportCheckModel, MissionInformationDate } from '@app/main/mission/mission.model';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Import List] Init', props<{ eventId: string; dates: MissionInformationDate[] }>());

export const selectFileOnInit = createAction(
  '[Import List] Select File On Init',
  props<{ selectedDateId: string; file: File }>(),
);

export const checkImportFile = createAction('[Import List] Check Import File', props<{ file: File }>());

export const checkImportFileSuccess = createAction(
  '[Import List] Check Import File Success',
  props<{ importData: ImportCheckModel }>(),
);

export const checkImportFileFailure = createAction('[Import List] Check Import File Failure');

export const continueImport = createAction('[Import List] Continue Import');

export const confirmImport = createAction('[Import List] Confirm Import');
export const confirmImportSuccess = createAction('[Import List] Confirm Import Success');

export const reset = createAction('[Import List] Reset');
