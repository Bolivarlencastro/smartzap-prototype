import { Component, Input } from '@angular/core';
import { LearningTrail, LearningTrailEnrollment, Step } from '../../model/learning-trail';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';

@Component({
  selector: 'learning-trail-progress',
  templateUrl: './learning-trail-progress.component.html',
  styleUrls: ['./learning-trail-progress.component.scss'],
  imports: [
    MatIcon,
    MatProgressBar,
    MatProgressSpinner,
    MatTooltip,
    DatePipe,
    TranslocoPipe,
    KpDurationPipe,
    KpPerformancePipe,
  ],
})
export class LearningTrailProgressComponent {
  @Input() steps!: Step[];
  @Input() learningTrail!: LearningTrail;
  @Input() enroll!: LearningTrailEnrollment;
  @Input() type!: string;
}
