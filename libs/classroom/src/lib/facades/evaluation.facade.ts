import { Injectable } from '@angular/core';
import { RawEvaluation } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { EvaluationActions } from '../store/actions';
import { classroomEvaluationFeature } from '../store/features';
import { BaseFacade } from './base.facade';

@Injectable({
  providedIn: 'root',
})
export class EvaluationFacade extends BaseFacade {
  readonly questions$ = this.select(classroomEvaluationFeature.selectQuestions);
  readonly evaluations$ = this.select(classroomEvaluationFeature.selectEvaluations);

  constructor(store: Store) {
    super(store);
  }

  loadEvaluationQuestions() {
    this.store.dispatch(EvaluationActions.loadEvaluationQuestions());
  }

  loadEvaluations(missionId: string, enrollmentId: string) {
    this.store.dispatch(EvaluationActions.loadEvaluations({ missionId, enrollmentId }));
  }

  postEvaluation(evaluation: RawEvaluation) {
    this.store.dispatch(EvaluationActions.postEvaluation({ evaluation }));
  }

  clearCache() {
    this.store.dispatch(EvaluationActions.clearCache());
  }
}
