import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnContentCardData } from './models';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KpSpeedDialComponent, KpSpeedDialOptionComponent } from '../kp-speed-dial';
import { KpInfoTagComponent } from '../kp-info-tag';
import { KpDurationPipe, KpLearnContentActionIconPipe, KpLearnContentActionLabelPipe } from '../../pipes';
import { KpCardTagComponent } from '../kp-card-tag';
import { TranslocoModule } from '@jsverse/transloco';
import { COURSE_MODEL } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardActionId, LearnContentCardOrientation } from '../../models';

const COURSE_PLACEHOLDER_MAP: Record<COURSE_MODEL, string> = {
  INTERNAL: 'https://assets.keepsdev.com/images/placeholders/v2/mission.png',
  SCORM: 'https://assets.keepsdev.com/images/placeholders/v2/mission.png',
  EXTERNAL_PROVIDER: 'https://assets.keepsdev.com/images/placeholders/v2/mission.png',
  LIVE: 'https://assets.keepsdev.com/images/placeholders/v2/live.png',
  PRESENTIAL: 'https://assets.keepsdev.com/images/placeholders/v2/presential.png',
};
const TRAIL_PLACEHOLDER = 'https://assets.keepsdev.com/images/placeholders/v2/trail.png';

function getPlaceholder(courseModel: string): string {
  return COURSE_PLACEHOLDER_MAP[courseModel as COURSE_MODEL] || TRAIL_PLACEHOLDER;
}

@Component({
  selector: 'kp-learn-content-card',
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    KpSpeedDialComponent,
    KpSpeedDialOptionComponent,
    KpInfoTagComponent,
    TranslocoModule,
    KpCardTagComponent,
    KpLearnContentActionIconPipe,
    KpLearnContentActionLabelPipe,
    KpDurationPipe,
  ],
  styleUrls: ['./kp-learn-content-card.component.scss'],
  templateUrl: './kp-learn-content-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpLearnContentCardComponent {
  mainAction: LearnContentCardActionId;
  remainingActions: LearnContentCardActionId[] = [];

  @Input() orientation: LearnContentCardOrientation = 'portrait';
  @Input() learnContent: LearnContentCardData;
  @Output() cardAction = new EventEmitter<LearnContentCardActionId>();

  @Input()
  set actions(actions: LearnContentCardActionId[]) {
    this.mapActions(actions);
  }

  @HostBinding('class')
  get orientationClass() {
    return this.orientation;
  }

  get backgroundImage() {
    return `url(${this.learnContent?.backgroundImage || getPlaceholder(this.learnContent?.missionModel)})`;
  }

  onCardAction(action: LearnContentCardActionId, event: MouseEvent) {
    event.stopPropagation();
    this.cardAction.emit(action);
  }

  private mapActions(actions: LearnContentCardActionId[]) {
    const actionsCopy = actions.slice(0);
    this.mainAction = actionsCopy.shift();
    this.remainingActions = actionsCopy;
  }
}
