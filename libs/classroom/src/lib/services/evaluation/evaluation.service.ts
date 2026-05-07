import { Injectable } from '@angular/core';
import { Evaluation } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  formatEvaluations(evaluations: Evaluation[]): Evaluation[] {
    return evaluations?.map(
      (evaluation) =>
        ({
          ...evaluation,
          questions_rating_avg: evaluation.questions_rating_avg?.toFixed(1) ?? 0,
        }) as Evaluation,
    );
  }
}
