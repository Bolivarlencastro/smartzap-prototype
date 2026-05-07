import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { QuestionRequest, QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface QuizAnswerEntry {
  exam_has_question: string;
  options: string[];
  correct_options: string[];
  is_ok: boolean;
}

export type QuizAnswersMap = Record<string, QuizAnswerEntry>;

export interface QuizSummary {
  total: number;
  correctAnswers: number;
}

@Injectable()
export class KpQuizCardService {
  private selection: QuestionRequest | null = null;

  private _selected = new BehaviorSubject(false);
  readonly selected$ = this._selected.asObservable();

  private _isAnswered = new BehaviorSubject(false);
  readonly answered$ = this._isAnswered.asObservable();

  private readonly _answers = new BehaviorSubject<QuizAnswersMap>({});
  readonly answers$ = this._answers.asObservable();

  private readonly _summary = new BehaviorSubject<QuizSummary>({ total: 0, correctAnswers: 0 });
  readonly summary$ = this._summary.asObservable();

  private readonly _nextContent = new Subject<void>();
  readonly nextContent$ = this._nextContent.asObservable();

  private readonly _goBack = new Subject<void>();
  readonly goBack$ = this._goBack.asObservable();

  private readonly _score = new BehaviorSubject<QuizScoreOutput | null>(null);
  readonly score$ = this._score.asObservable();

  private readonly _loadingScore = new BehaviorSubject<boolean>(false);
  readonly loadingScore$ = this._loadingScore.asObservable();

  private readonly _showNextContent = new BehaviorSubject<boolean>(true);
  readonly showNextContent$ = this._showNextContent.asObservable();

  private _lastSelectedQuestion: string | null = null;

  nextContent(): void {
    this._nextContent.next();
  }

  goBack(): void {
    this._goBack.next();
  }

  selectOption(option: QuestionRequest): void {
    if (option.options.length === 0) {
      this.clearSelection();
      return;
    }
    this.selection = option;
    this._selected.next(true);
  }

  clearSelection(): void {
    this.selection = null;
    this._selected.next(false);
  }

  getCurrentSelection(): QuestionRequest | null {
    return this.selection;
  }

  disableSelection(): void {
    this._selected.next(false);
  }

  answered(questionId: string): void {
    const answers = this._answers.getValue();
    this._isAnswered.next(!!answers[questionId]);
    this._lastSelectedQuestion = questionId;
  }

  setScore(score: QuizScoreOutput | null): void {
    this._score.next(score);
  }

  setLoadingScore(loading: boolean): void {
    this._loadingScore.next(loading);
  }

  setShowNextContent(show: boolean): void {
    this._showNextContent.next(show);
  }

  setAnswers(answers: QuizAnswerEntry[]): void {
    const answersMap = this.convertAnswersToMap(answers);
    const summary = this.buildSummary(answers);
    this._summary.next(summary);
    this._answers.next(answersMap);
    if (this._lastSelectedQuestion) {
      this.answered(this._lastSelectedQuestion);
    }
  }

  private convertAnswersToMap(answers: QuizAnswerEntry[]): QuizAnswersMap {
    return answers.reduce<QuizAnswersMap>((acc, cur) => {
      acc[cur.exam_has_question] = cur;
      return acc;
    }, {});
  }

  private buildSummary(answers: QuizAnswerEntry[]): QuizSummary {
    return answers.reduce(
      (acc, cur) => {
        if (cur.is_ok) acc.correctAnswers++;
        acc.total++;
        return acc;
      },
      { total: 0, correctAnswers: 0 },
    );
  }
}
