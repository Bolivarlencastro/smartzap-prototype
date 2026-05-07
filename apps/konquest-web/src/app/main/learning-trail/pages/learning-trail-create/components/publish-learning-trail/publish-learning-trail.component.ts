import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { LearningTrailFormHeaderComponent } from '../learning-trail-form-header/learning-trail-form-header.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LearningTrailCreateActions } from '../../store';
import { LearningTrail, Step } from '@keeps-platform-frontend-workspace/ui/kp-learning-trail-detail-steps';
import { LearningTrailProgressComponent } from '../../../../components/learning-trail-progress/learning-trail-progress.component';

@Component({
  selector: 'app-publish-learning-trail',
  imports: [TranslocoModule, MatButtonModule, LearningTrailFormHeaderComponent, LearningTrailProgressComponent],
  template: ` <app-learning-trail-form-header
      class="w-full mb-4"
      [title]="'LEARNING_TRAIL.STEP.RESUME_OF_YOUR_NEW_TRAIL' | transloco"
      [hidePrevious]="false"
      nextButtonLabel="LEARNING_TRAIL.STEP.FINISH"
      (next)="onNavigateToTrail()"
      (previous)="previous()"
    ></app-learning-trail-form-header>
    <div class="flex flex-col">
      <learning-trail-progress
        class="w-full mt-10"
        [learningTrail]="learningTrail"
        [steps]="steps"
        [type]="'final-step'"
      ></learning-trail-progress>
      <div class="mt-10 px-15 flex justify-between items-center"></div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishLearningTrailComponent {
  @Input() learningTrail!: LearningTrail;
  @Input() steps!: Step[];
  @Output() navigateToTrail = new EventEmitter<void>();

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  previous() {
    this.store.dispatch(LearningTrailCreateActions.previousStep());
  }

  onNavigateToTrail() {
    this.navigateToTrail.emit();
  }
}
