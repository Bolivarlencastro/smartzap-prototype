import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EnrollmentConfig,
  KpEnrollmentSettingsFormComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-linked-dialog-footer',
  templateUrl: './group-linked-dialog-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogActions, KpEnrollmentSettingsFormComponent, MatButton, MatDialogClose, TranslocoPipe],
})
export class GroupLinkedDialogFooterComponent {
  @Input() size: number;
  @Input() cycles: CycleDto[] = [];
  @Input() isNormativeActive: boolean;
  @Input() displayEnrollmentSettings = true;
  @Output() submitEvent = new EventEmitter<EnrollmentConfig | undefined>();
  @Output() filterCycle = new EventEmitter<string>();

  protected enrollmentConfig: EnrollmentConfig;

  get submitDisabled(): boolean {
    return !this.size;
  }

  onSubmit(): void {
    this.submitEvent.emit(this.enrollmentConfig);
  }

  setEnrollmentConfig(config: EnrollmentConfig): void {
    this.enrollmentConfig = config;
  }

  resetDataForm(): void {
    this.enrollmentConfig = null;
  }

  onFilterCycle(event: string) {
    this.filterCycle.emit(event);
  }
}
