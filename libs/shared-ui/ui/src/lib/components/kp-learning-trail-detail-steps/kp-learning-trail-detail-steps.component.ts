import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { KpTrailStepNameRouteDirective } from '../../directives';
import { Pulse, Step, StepCertificate, StepCertificateAction, TrailStepItem, TrailStepType } from './model';
import { Mission, MissionProvider } from '../kp-mission-model/model';
import { KpCardTagComponent } from '../kp-card-tag';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpStatusChipComponent } from '../kp-status-chip/kp-status-chip.component';
import { KpDurationPipe, KpEnrollmentStatusColorPipe } from '../../pipes';

@Component({
  selector: 'kp-learning-trail-detail-steps',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    MatIconModule,
    KpStatusChipComponent,
    MatButtonModule,
    KpTrailStepNameRouteDirective,
    KpCardTagComponent,
    KpEnrollmentStatusColorPipe,
    KpDurationPipe,
  ],
  templateUrl: './kp-learning-trail-detail-steps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpLearningTrailDetailStepsComponent implements OnChanges {
  @Input() stepItems: Step[];
  @Input() userId: string;
  @Input() isEnrolledInTrail: boolean;
  @Output() stepCertificateAction = new EventEmitter<StepCertificate>();
  @Output() stepSelected = new EventEmitter<StepCertificateAction>();
  @Output() missionDetailEvent = new EventEmitter<Mission>();
  items: TrailStepItem[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && (changes['stepItems'] || changes['isEnrolledInTrail'])) {
      this.buildStepItems();
    }
  }

  buildStepItems(): void {
    this.items = this.stepItems
      .filter((step) => step.mission || step.pulse)
      .map((step, index) => {
        const type: TrailStepType = step.mission ? 'mission' : 'pulse';
        const listIndex = (index + 1).toString().padStart(2, '0');
        const trailStep = {
          step,
          type,
          listIndex,
          ...this.parseTrailStep(type === 'mission' ? step.mission : step.pulse),
        };
        const target =
          type === 'mission' ? this.parseMissionTrailStep(step.mission) : this.parsePulseTrailStep(step.pulse);
        return { ...trailStep, ...target };
      });
  }

  displayStepUploadIcon(step: TrailStepItem): boolean {
    return step?.missionModel === 'EXTERNAL_PROVIDER' && !!step?.status && step?.status !== 'COMPLETED';
  }

  disableStepUploadIcon(step: TrailStepItem): boolean {
    return step?.status !== 'STARTED' || step?.development_status !== DevelopmentStatus.DONE;
  }

  displayStepDownloadIcon(step: TrailStepItem): boolean {
    return step?.missionModel === 'EXTERNAL_PROVIDER' ? step?.status === 'COMPLETED' : !!step?.status;
  }

  disableStepDownloadIcon(step: TrailStepItem): boolean {
    return step?.status !== 'COMPLETED';
  }

  shouldDisablePlayIcon(step: TrailStepItem): boolean {
    if (!this.isEnrolledInTrail) {
      return true;
    }

    if (step.type === 'mission' && step?.development_status !== DevelopmentStatus.DONE) {
      return true;
    }

    const isInternalMission = step?.missionModel === 'INTERNAL';
    const hasStatus = !!step.status;
    const isNotInContinuableStatus =
      step?.status !== 'ENROLLED' && step?.status !== 'STARTED' && step?.status !== 'COMPLETED';

    return isInternalMission && hasStatus && isNotInContinuableStatus;
  }

  stepCertificate(action: string, id: string): void {
    this.stepCertificateAction.emit({ action, id });
  }

  stepClick({ type, step }: TrailStepItem): void {
    this.stepSelected.emit({ type, step });
  }

  openMissionDetail(mission: Mission): void {
    this.missionDetailEvent.emit(mission);
  }

  private parseTrailStep(target: Mission | Pulse): Pick<TrailStepItem, 'id' | 'name'> {
    return {
      id: target.id,
      name: target.name,
    };
  }

  private parseMissionTrailStep(
    mission: Mission,
  ): Pick<
    TrailStepItem,
    | 'status'
    | 'progress'
    | 'externalCourse'
    | 'development_status'
    | 'language'
    | 'duration'
    | 'missionModel'
    | 'isOwner'
  > {
    const status = mission.enrollment?.status;
    const progress = status === 'COMPLETED' ? 1 : mission.enrollment?.progress || 0;
    const externalCourse = (mission.provider as MissionProvider)?.description;
    const development_status = mission.development_status;
    const language = mission.language;
    const duration = mission.duration_time;
    const missionModel = mission.mission_model;
    const isOwner = mission.user_creator?.id === this.userId;
    return { status, progress, externalCourse, development_status, language, duration, missionModel, isOwner };
  }

  private parsePulseTrailStep(pulse: Pulse): Pick<TrailStepItem, 'language' | 'duration' | 'progress'> {
    const language = pulse.language;
    const duration = pulse.duration_time;
    const progress = Number(pulse.consume_time_in || 0) / Number(pulse.duration_time || 1);
    return { language, duration, progress };
  }
}
