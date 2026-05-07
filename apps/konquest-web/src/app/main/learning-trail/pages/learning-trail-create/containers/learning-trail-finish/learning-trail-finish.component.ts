import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LearningTrail, Step } from '@app/main/learning-trail/model/learning-trail';
import { PublishLearningTrailComponent } from '../../components/publish-learning-trail/publish-learning-trail.component';
import { Store } from '@ngrx/store';
import { learningTrailCreateFeature } from '../../store/features/learning-trail-create.feature';
import { LearningTrailCreateActions } from '../../store';

@Component({
  selector: 'app-learning-trail-finish',
  imports: [CommonModule, PublishLearningTrailComponent],
  template: ` <app-publish-learning-trail
    [steps]="steps$ | async"
    [learningTrail]="learningTrail$ | async"
    (navigateToTrail)="navigateToTrail()"
  ></app-publish-learning-trail>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailFinishComponent {
  learningTrail$: Observable<LearningTrail>;
  steps$: Observable<Step[]>;

  constructor(private store: Store) {
    this.learningTrail$ = this.store.select(learningTrailCreateFeature.selectLearningTrail);
    this.steps$ = this.store.select(learningTrailCreateFeature.selectLearningTrailSteps);
  }

  navigateToTrail(): void {
    this.store.dispatch(LearningTrailCreateActions.navigateToTrail());
  }
}
