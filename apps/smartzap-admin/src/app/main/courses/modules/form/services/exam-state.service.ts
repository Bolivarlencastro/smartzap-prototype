import { Injectable } from '@angular/core';
import { ExamService } from '@core/services';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Question } from 'app/main/courses/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

type State = Record<string, Question[]>;

@Injectable()
export class ExamStateService {
  private state: State;
  private _questions: BehaviorSubject<State>;

  constructor(
    private _examService: ExamService,
    private messageService: KpMessageService,
  ) {
    this.state = {};
    this._questions = new BehaviorSubject(this.state);
  }

  fetchQuestions(examId: string): Observable<Question[]> {
    return this._examService.fetchExamQuestions(examId).pipe(
      tap((questions) => this.setQuestionsToExam(examId, questions)),
      switchMap(() => this.getQuestionsByExam(examId)),
    );
  }

  setQuestionsToExam(examId: string, questions: Question[]): void {
    this.state[examId] = questions;
    this._questions.next(this.state);
  }

  createQuestion({ examId, question }: { examId: string; question: Partial<Question> }): Observable<Question> {
    return this._examService.createExamQuestion({ examId, question }).pipe(
      tap((question) => {
        if (!this.state[examId]) this.state[examId] = [];
        this.state[examId].push(question);
        this._questions.next(this.state);
      }),
    );
  }

  updateQuestion({ examId, question }: { examId: string; question: Partial<Question> }): Observable<Question> {
    return this._examService.updateExamQuestion({ question }).pipe(
      tap({
        next: (question) => {
          if (!this.state[examId]) this.state[examId] = [];
          const questionIndex = this.state[examId].findIndex(({ id }) => id === question.id);
          if (questionIndex !== -1) {
            this.state[examId][questionIndex] = question;
          } else {
            this.state[examId].push(question);
          }
          this._questions.next(this.state);
        },
        error: () => this.messageService.error('ERRORS.UNABLE_TO_EDIT_QUESTION'),
      }),
    );
  }

  removeQuestion({ examId, questionId }: { examId: string; questionId: string }): Observable<void> {
    return this._examService.removeExamQuestion({ questionId }).pipe(
      tap({
        next: () => {
          if (!this.state[examId]) this.state[examId] = [];
          this.state[examId] = this.state[examId].filter(({ id }) => id !== questionId);
          this._questions.next(this.state);
        },
        error: () => this.messageService.error('ERRORS.UNABLE_TO_DELETE_QUESTION'),
      }),
    );
  }

  getQuestionsByExam(examId: string): Observable<Question[]> {
    return this._questions.asObservable().pipe(map((state) => state[examId]));
  }
}
