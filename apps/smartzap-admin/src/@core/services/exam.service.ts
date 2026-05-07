import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KontentAPI, KontentPaginatedResponse } from '@core/api';
import { Question } from 'app/main/courses/model';

const PATH = '/assessments';

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private _http: KontentAPI) {}

  createExam(data: any): Observable<any> {
    return this._http.post(`${PATH}/exams`, data);
  }

  fetchExamQuestions(examId: string, options: { perPage: number } = { perPage: 999 }): Observable<Question[]> {
    return this._http
      .get<KontentPaginatedResponse<Question>>(`${PATH}/exams/${examId}/questions`, { per_page: options.perPage })
      .pipe(map(({ results }) => results));
  }

  createExamQuestion({ examId, question }: { examId: string; question: Partial<Question> }): Observable<Question> {
    return this._http.post(`${PATH}/exams/${examId}/questions`, question);
  }

  updateExamQuestion({ question }: { question: Partial<Question> }): Observable<Question> {
    return this._http.patch(`${PATH}/questions/${question.id}`, question);
  }

  removeExamQuestion({ questionId }: { questionId: string }): Observable<void> {
    return this._http.delete(`${PATH}/questions/${questionId}`);
  }
}
