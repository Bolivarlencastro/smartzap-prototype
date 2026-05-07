import { createAction, props } from '@ngrx/store';
import { QuizCreationMethod, QuizType } from '../../components/quiz-wizard-dialog/quiz-wizard-dialog.component';
import { QuizFormModel, QuizOutput } from '../../models/quiz';

const openQuizWizardDialog = createAction(
  '[Quiz] Open Quiz Wizard Dialog',
  props<{ channelId?: string | null; stageId?: string | null }>(),
);

const quizWizardDialogCancelled = createAction('[Quiz] Quiz Wizard Dialog Cancelled');

const openQuizDialog = createAction(
  '[Quiz] Open Quiz Dialog',
  props<{
    quizType: QuizType;
    creationMethod: QuizCreationMethod;
    channelId?: string | null;
    stageId?: string | null;
  }>(),
);

const quizDialogClosed = createAction('[Quiz] Quiz Dialog Closed');

const openQuizEditDialog = createAction('[Quiz] Open Quiz Edit Dialog', props<{ quizId: string }>());

const loadQuizForEditSuccess = createAction('[Quiz] Load Quiz For Edit Success', props<{ quiz: QuizOutput }>());

const loadQuizForEditFailure = createAction('[Quiz] Load Quiz For Edit Failure', props<{ error: string }>());

const createQuiz = createAction('[Quiz] Create Quiz', props<{ quiz: QuizFormModel }>());

const createQuizSuccess = createAction('[Quiz] Create Quiz Success', props<{ quiz: QuizOutput }>());

const createQuizFailure = createAction('[Quiz] Create Quiz Failure', props<{ error: string }>());

const updateQuiz = createAction('[Quiz] Update Quiz', props<{ quiz: QuizFormModel }>());

const updateQuizSuccess = createAction('[Quiz] Update Quiz Success', props<{ quiz: QuizOutput }>());

const updateQuizFailure = createAction('[Quiz] Update Quiz Failure', props<{ error: string }>());

const deleteQuestion = createAction('[Quiz] Delete Question', props<{ quizId: string; questionId: string }>());

export const QuizActions = {
  openQuizWizardDialog,
  quizWizardDialogCancelled,
  openQuizDialog,
  quizDialogClosed,
  openQuizEditDialog,
  loadQuizForEditSuccess,
  loadQuizForEditFailure,
  createQuiz,
  createQuizSuccess,
  createQuizFailure,
  updateQuiz,
  updateQuizSuccess,
  updateQuizFailure,
  deleteQuestion,
};
