import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { Pagination } from '../../pagination';
import { Evaluation, EvaluationQuestions, RawEvaluation } from '../models';

@Injectable({ providedIn: 'root' })
export class EvaluationsApi {
  constructor(private http: KonquestClient) {}

  getEvaluations(filters?: Record<string, unknown>) {
    return this.http.get<Pagination<Evaluation>>(`/missions/evaluations`, filters);
  }

  getEvaluationsQuestions() {
    return this.http.get<EvaluationQuestions>(`/missions/evaluations-questions`);
  }

  postEvaluation(body: RawEvaluation) {
    return this.http.post<Evaluation>(`/missions/evaluations`, body);
  }
}
