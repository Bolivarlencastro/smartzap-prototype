import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { EnrollmentConfig } from './model';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpFormMenuComponent } from './components/kp-form-menu.component';
import { KpEnrollmentSettingResumeComponent } from './components/kp-enrollment-setting-resume/kp-enrollment-setting-resume.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'kp-enrollment-settings-form',
  templateUrl: './kp-enrollment-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatMenuTrigger,
    MatIcon,
    KpEnrollmentSettingResumeComponent,
    MatMenu,
    KpFormMenuComponent,
    TranslocoPipe,
  ],
})
export class KpEnrollmentSettingsFormComponent {
  @Input() cycles: CycleDto[] = [];
  @Input() isNormativeActive: boolean;
  @Input() enrollmentConfig: EnrollmentConfig;
  @Output() formSubmit = new EventEmitter<EnrollmentConfig>();
  @Output() resetEvent = new EventEmitter<void>();
  @Output() filterCycle = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  date: string;
  cycle: string;
  resume: string;

  closeMenu(): void {
    this.menuTrigger.closeMenu();
  }

  onSubmit(data: EnrollmentConfig): void {
    this.formSubmit.emit(data);
    this.closeMenu();
  }

  resetDataForm(): void {
    this.resetEvent.emit();
  }

  onFilterCycle(event: string) {
    this.filterCycle.emit(event);
  }
}
