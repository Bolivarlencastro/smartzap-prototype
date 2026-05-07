import { computed, inject, Injectable, signal } from '@angular/core';
import { applyEach, form, maxLength, minLength, required, SchemaPath, validate } from '@angular/forms/signals';
import { QuestionInput, QuizFormModel } from '../../models/quiz';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Observable } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

const DEFAULT_QUESTION: QuestionInput = {
  question_text: '',
  options: [
    { option: '', correct_answer: false },
    { option: '', correct_answer: false },
  ],
  save_to_bank: false,
};

function correctAnswer(path: SchemaPath<QuestionInput>) {
  validate(path, ({ value }) => {
    const options = value().options;
    const hasCorrectAnswer = options?.some((option) => option.correct_answer === true);

    if (!hasCorrectAnswer) {
      return { kind: 'invalid', message: 'Question must have at least one correct answer' };
    }

    return null;
  });
}

@Injectable()
export class QuizFormService {
  private readonly _dialog = inject(MatDialog);

  private readonly quizModel = signal<QuizFormModel>({
    title: '',
    questions_to_show: null,
    randomize_questions: false,
    randomize_options: false,
    questions: [],
  });

  readonly quizForm = form(this.quizModel, (schema) => {
    required(schema.title, { message: 'Quiz title is required' });
    minLength(schema.questions, 1, { message: 'At least one question is required' });
    applyEach(schema.questions, (questionPath) => {
      required(questionPath.question_text, { message: 'Question text is required' });
      minLength(questionPath.options, 2, { message: 'At least 2 options are required' });
      maxLength(questionPath.options, 5, { message: 'At most 5 options are allowed' });
      correctAnswer(questionPath);
      applyEach(questionPath.options, (optionPath) => {
        required(optionPath.option, { message: 'Option text is required' });
      });
    });
    validate(schema.questions_to_show, ({ value }) => {
      const count = +value();
      if (count === null || count === undefined) {
        return null;
      }

      if (!Number.isInteger(count) || count < 0) {
        return { kind: 'invalid-questions-to-show', message: 'Must be a positive integer' };
      }

      if (count > this.quizModel().questions.length) {
        return { kind: 'questions-to-show-limit', message: 'Cannot exceed total question count' };
      }

      return null;
    });
  });

  readonly questionModels = this.quizForm.questions;
  readonly questionCount = computed(() => this.quizModel().questions.length);
  readonly isFormValid = computed(() => this.quizForm().valid());
  readonly canDeleteQuestion = computed(() => this.quizModel().questions.length > 1);

  getQuiz(): QuizFormModel {
    return this.quizModel();
  }

  setQuiz(quiz: QuizFormModel) {
    const updatedQuiz = structuredClone(quiz);
    this.quizModel.set(updatedQuiz);
  }

  addQuestion(): void {
    const newQuestion = structuredClone(DEFAULT_QUESTION);
    this.quizModel.update((quiz) => {
      return { ...quiz, questions: [...quiz.questions, newQuestion] };
    });
  }

  removeQuestion(index: number): void {
    this.quizModel.update((quiz) => {
      const questions = quiz.questions.filter((_, i) => i !== index);
      const questionsToShow =
        quiz.questions_to_show !== null &&
        quiz.questions_to_show !== undefined &&
        quiz.questions_to_show > questions.length
          ? questions.length
          : quiz.questions_to_show;
      return { ...quiz, questions, questions_to_show: questionsToShow };
    });
  }

  confirmAndRemoveQuestion(index: number): Observable<void> {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = 'QUIZ.QUIZ_QUESTION_FORM.DELETE_CONFIRM_TITLE';
    dialogRef.componentInstance.confirmMessage = 'QUIZ.QUIZ_QUESTION_FORM.DELETE_CONFIRM_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    return dialogRef.afterClosed().pipe(
      filter(Boolean),
      map(() => this.removeQuestion(index)),
    );
  }

  addQuestionOption(questionIndex: number): void {
    const question = this.quizModel().questions[questionIndex];
    const updatedQuestion = { ...question, options: [...question.options, { option: '', correct_answer: false }] };
    const updatedQuestions = [
      ...this.quizModel().questions.slice(0, questionIndex),
      updatedQuestion,
      ...this.quizModel().questions.slice(questionIndex + 1),
    ];

    this.quizModel.update((quiz) => {
      return { ...quiz, questions: updatedQuestions };
    });
  }

  removeQuestionOption(questionIndex: number, optionIndex: number): void {
    const question = this.quizModel().questions[questionIndex];
    const updatedQuestion = { ...question, options: question.options.filter((_, i) => i !== optionIndex) };

    const updatedQuestions = [
      ...this.quizModel().questions.slice(0, questionIndex),
      updatedQuestion,
      ...this.quizModel().questions.slice(questionIndex + 1),
    ];

    this.quizModel.update((quiz) => {
      return { ...quiz, questions: updatedQuestions };
    });
  }

  addQuestionFromBank(question: QuestionInput): void {
    const normalized: QuestionInput = { save_to_bank: false, ...question };
    this.quizModel.update((quiz) => ({
      ...quiz,
      questions: [...quiz.questions, structuredClone(normalized)],
    }));
  }

  updateQuestionText(questionIndex: number, text: string): void {
    const question = this.quizModel().questions[questionIndex];
    const updatedQuestion = { ...question, question_text: text };
    const updatedQuestions = [
      ...this.quizModel().questions.slice(0, questionIndex),
      updatedQuestion,
      ...this.quizModel().questions.slice(questionIndex + 1),
    ];

    this.quizModel.update((quiz) => {
      return { ...quiz, questions: updatedQuestions };
    });
  }
}
