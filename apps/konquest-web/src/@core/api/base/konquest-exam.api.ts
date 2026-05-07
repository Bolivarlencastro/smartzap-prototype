import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KonquestAPI } from './konquest.api';
import { Question, Exam } from '@core/model/exam';

const PATH = '/exams';

@Injectable({ providedIn: 'root' })
export class KonquestExamAPI {
  constructor(protected http: KonquestAPI) {}

  /**
   * Create stage exam given an valid stage id
   *
   * @param id stage id
   * @param title exam title
   */
  createStageExam(id: string, title: string): Observable<Exam> {
    return this.http.post(`${PATH}`, { title, stage: id });
  }

  /**
   * Create an pulse exam given an valid pulse id
   *
   * @param id pulse id
   * @param title exam title
   */
  createPulseExam(title: string): Observable<Exam> {
    return this.http.post(`${PATH}`, { title });
  }

  /**
   * Get one exam given the id
   *
   * @param id exam id
   * @param params
   */
  getExamQuestions(id: string, params: Record<string, unknown> = {}): Observable<any> {
    return this.http.get(`${PATH}/${id}/questions`, params);
  }

  /**
   * Create a question given an exam id
   *
   * @param id The exam id
   * @param question The object question
   */
  public createExamQuestion(id: string, question: Question): Observable<Question> {
    return this.http.post(`${PATH}/${id}/questions`, question);
  }

  /**
   * Update a question given an exam id and a question id
   *
   * @param id The exam id
   * @param questionId Question id
   * @param question The object question
   */
  public updateExamQuestion(id: string, questionId: string, question: Question): Observable<Question> {
    return this.http.patch(`${PATH}/${id}/questions/${questionId}`, question);
  }

  /**
   * Update a question given an exam id and a question id
   *
   * @param id The exam id
   * @param questionId Question id
   */
  public removeExamQuestion(id: string, questionId: string): Observable<void> {
    return this.http.delete(`${PATH}/${id}/questions/${questionId}`);
  }
}
