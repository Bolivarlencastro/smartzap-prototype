import { createFeature, createReducer, on } from '@ngrx/store';
import { QuestionInput } from '../../models/quiz';
import { CsvImportActions } from './csv-import.actions';

export type CsvImportStatus = 'idle' | 'parsing' | 'success' | 'error';

export interface CsvImportState {
  status: CsvImportStatus;
  questions: QuestionInput[];
  errorMessage: string | null;
  fileName: string | null;
}

const initialState: CsvImportState = {
  status: 'idle',
  questions: [],
  errorMessage: null,
  fileName: null,
};

export const csvImportFeature = createFeature({
  name: 'csv-import-feature',
  reducer: createReducer(
    initialState,
    on(
      CsvImportActions.parseFile,
      (state): CsvImportState => ({ ...state, status: 'parsing', questions: [], errorMessage: null }),
    ),
    on(
      CsvImportActions.parseFileSuccess,
      (state, { questions, fileName }): CsvImportState => ({ ...state, status: 'success', questions, fileName }),
    ),
    on(
      CsvImportActions.parseFileFailure,
      (state, { error }): CsvImportState => ({ ...state, status: 'error', errorMessage: error }),
    ),
    on(
      CsvImportActions.toggleSaveToBank,
      (state, { index }): CsvImportState => ({
        ...state,
        questions: state.questions.map((q, i) => (i === index ? { ...q, save_to_bank: !q.save_to_bank } : q)),
      }),
    ),
    on(
      CsvImportActions.addAllToBank,
      (state): CsvImportState => ({
        ...state,
        questions: state.questions.map((q) => ({ ...q, save_to_bank: true })),
      }),
    ),
    on(CsvImportActions.reset, (): CsvImportState => initialState),
  ),
});
