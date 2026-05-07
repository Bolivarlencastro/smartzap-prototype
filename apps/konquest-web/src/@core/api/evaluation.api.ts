import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { EvaluationQuestions, Evaluation, RawEvaluation, EvaluationSummary } from '../model/evaluation.model';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';

@Injectable({ providedIn: 'root' })
export class EvaluationAPI {
  private basePath = '/missions';
  public unsubscribeComponent$ = new Subject<void>();
  public unsubscribe$ = this.unsubscribeComponent$.asObservable();

  constructor(private _http: KonquestAPI) {}

  getEvaluations(filters?: Record<string, unknown>): Observable<Pagination<Evaluation>> {
    return this._http.get<Pagination<Evaluation>>(`${this.basePath}/evaluations`, filters);
  }

  getEvaluationsQuestions(): Observable<EvaluationQuestions> {
    return this._http.get<EvaluationQuestions>(`${this.basePath}/evaluations-questions`);
  }

  getEvaluationSummary(id: string, filters?: any): Observable<EvaluationSummary> {
    return this._http.get<EvaluationSummary>(`${this.basePath}/${id}/evaluations/summary/1`, filters);
  }

  postEvaluation(body: RawEvaluation): Observable<Evaluation> {
    return this._http.post<Evaluation>(`${this.basePath}/evaluations`, body);
  }
}
