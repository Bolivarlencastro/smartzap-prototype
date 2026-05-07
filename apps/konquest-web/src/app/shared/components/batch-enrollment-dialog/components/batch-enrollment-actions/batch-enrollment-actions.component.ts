import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BatchEnrollmentViewMode } from 'app/shared/components/batch-enrollment-dialog/models/batch-enrollment-view-mode';
import {
  EnrollmentConfig,
  KpEnrollmentSettingsFormComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BatchEnrollmentType } from '@app/shared/services/batch-enrollment.service';
import { MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-batch-enrollment-actions',
  templateUrl: './batch-enrollment-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogActions, KpEnrollmentSettingsFormComponent, MatButton, TranslocoPipe],
})
export class BatchEnrollmentActionsComponent {
  @Input({ required: true }) viewMode: BatchEnrollmentViewMode;
  @Input({ required: true }) submitDisabled: boolean;
  @Input() cycles: CycleDto[] = [];
  @Input() isNormativeActive: boolean;
  @Input() enrollmentConfig: EnrollmentConfig;
  @Input() type: BatchEnrollmentType;
  @Input() reachedLimitSeats: boolean;
  @Input() remainingSeats: number;

  @Output() enrollOthers = new EventEmitter<boolean>();
  @Output() continue = new EventEmitter<void>();
  @Output() enroll = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
  @Output() setEnrollmentConfig = new EventEmitter<EnrollmentConfig>();
  @Output() filterCycle = new EventEmitter<string>();

  get positiveButtonLabel(): string {
    switch (this.viewMode) {
      case 'finish':
        return marker('BATCH_ENROLLMENT.ACTIONS.FINISH');
      case 'notFound':
        return 'GENERAL.CONTINUE';
      default:
        return this.type === 'event'
          ? marker('BATCH_ENROLLMENT.ACTIONS.EVENTS_ENROLL_USERS')
          : marker('BATCH_ENROLLMENT.ACTIONS.ENROLL_USERS');
    }
  }

  get negativeButtonLabel(): string {
    switch (this.viewMode) {
      case 'finish':
        return this.type === 'event'
          ? marker('BATCH_ENROLLMENT.ACTIONS.EVENTS_ENROLL_OTHERS')
          : marker('BATCH_ENROLLMENT.ACTIONS.ENROLL_OTHERS');
      case 'notFound':
      case 'resume':
        return marker('BATCH_ENROLLMENT.ACTIONS.SELECT_MORE');
      default:
        return 'GENERAL.CANCEL';
    }
  }

  get showConfigForm(): boolean {
    return this.viewMode !== 'finish' && this.viewMode !== 'resume';
  }

  onSettingsSubmit(config: EnrollmentConfig) {
    this.setEnrollmentConfig.emit(config);
  }

  onPositiveClick(): void {
    switch (this.viewMode) {
      case 'finish':
        this.closeDialog.emit();
        break;
      case 'notFound':
        this.continue.emit();
        break;
      default:
        this.enroll.emit();
    }
  }

  onNegativeClick(): void {
    switch (this.viewMode) {
      case 'finish':
        this.enrollOthers.emit(true);
        break;
      case 'notFound':
      case 'resume':
        this.enrollOthers.emit(false);
        break;
      default:
        return this.closeDialog.emit();
    }
  }

  onFilterCycle(event: string) {
    this.filterCycle.emit(event);
  }
}
