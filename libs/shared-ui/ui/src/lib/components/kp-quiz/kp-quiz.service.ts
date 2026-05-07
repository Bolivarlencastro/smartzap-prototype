import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class KpQuizService {
  private selection = [];

  private _selected = new BehaviorSubject(false);
  readonly selected$ = this._selected.asObservable();

  private _isAnswered = new BehaviorSubject(false);
  readonly answered$ = this._isAnswered.asObservable();

  private _answeres = new BehaviorSubject<Record<string, any>>({});
  readonly answeres$ = this._answeres.asObservable();

  private _summary = new BehaviorSubject({});
  readonly summary$ = this._summary.asObservable();

  private _answer = new BehaviorSubject('');
  readonly answer$ = this._answer.asObservable();

  private _lastSelectedQuestion: string;

  selectOption(selection: string[]) {
    this.selection = selection;
    this._selected.next(!!this.selection?.length);
  }

  clearSelection() {
    this.selection = [];
    this._selected.next(false);
  }

  getCurrentSelection() {
    return this.selection;
  }

  answered(questionId: string): void {
    const answers = this._answeres.getValue();
    const answer = answers[questionId];
    this._isAnswered.next(!!answer);
    this._answer.next(answer);
    this._lastSelectedQuestion = questionId;
    if (!answer) {
      this._selected.next(false);
    }
  }

  setAnswers(answeres: any[]) {
    const answersMap = this.convertAnswersToMap(answeres);
    const summary = this.buildSummary(answeres);
    this._summary.next(summary);
    this._answeres.next(answersMap);
    if (this._lastSelectedQuestion) {
      this.answered(this._lastSelectedQuestion);
    }
  }

  convertAnswersToMap(answeres: any[]): any {
    return answeres.reduce((acc, cur) => {
      const question = cur.question;

      if (cur.options) {
        acc[question] = cur.options;
      } else {
        acc[question] = cur.text_response;
      }

      return acc;
    }, {});
  }

  buildSummary(answeres: any[]): any {
    return answeres.reduce(
      (acc, cur) => {
        if (cur.is_ok) {
          acc.correctAnswers++;
        }
        acc.total++;
        return acc;
      },
      { total: 0, correctAnswers: 0 },
    );
  }
}
