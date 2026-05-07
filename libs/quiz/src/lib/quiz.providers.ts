import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { quizFeature } from './store/quiz';
import { QuizEffects } from './store/quiz/quiz.effects';
import { questionBankFeature } from './store/question-bank/question-bank.feature';
import { QuestionBankEffects } from './store/question-bank/question-bank.effects';
import { csvImportFeature } from './store/csv-import/csv-import.feature';
import { CsvImportEffects } from './store/csv-import/csv-import.effects';
import { getTranslocoScope } from './transloco-scope.factory';

export const QUIZ_PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(quizFeature),
    StoreModule.forFeature(questionBankFeature),
    StoreModule.forFeature(csvImportFeature),
    EffectsModule.forFeature([QuizEffects, QuestionBankEffects, CsvImportEffects]),
  ]),
  getTranslocoScope(),
];
