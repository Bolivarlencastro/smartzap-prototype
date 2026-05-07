import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluationQuestions } from '../models';
import { KonquestClient } from './konquest.client';

@Injectable({ providedIn: 'root' })
export class EvaluationAPI {
  private basePath = '/missions';

  constructor(private _http: KonquestClient) {}

  getEvaluations(filters?: Record<string, unknown>) {
    return this._http.get<any>(`${this.basePath}/evaluations`, filters);
  }

  getEvaluationsQuestions(): Observable<EvaluationQuestions> {
    return this._http.get(`${this.basePath}/evaluations-questions`);
  }

  getEvaluationSummary(id: string, filters?: any) {
    return this._http.get(`${this.basePath}/${id}/evaluations/summary/1`, filters);
  }

  postEvaluation(body: unknown) {
    return this._http.post(`${this.basePath}/evaluations`, body);
  }
}
