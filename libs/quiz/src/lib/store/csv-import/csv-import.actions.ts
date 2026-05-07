import { createAction, props } from '@ngrx/store';
import { QuestionInput } from '../../models/quiz';

const parseFile = createAction('[CSV Import] Parse File', props<{ file: File }>());
const parseFileSuccess = createAction(
  '[CSV Import] Parse File Success',
  props<{ questions: QuestionInput[]; fileName: string }>(),
);
const parseFileFailure = createAction('[CSV Import] Parse File Failure', props<{ error: string }>());
const toggleSaveToBank = createAction('[CSV Import] Toggle Save To Bank', props<{ index: number }>());
const addAllToBank = createAction('[CSV Import] Add All To Bank');
const reset = createAction('[CSV Import] Reset');

export const CsvImportActions = {
  parseFile,
  parseFileSuccess,
  parseFileFailure,
  toggleSaveToBank,
  addAllToBank,
  reset,
};
