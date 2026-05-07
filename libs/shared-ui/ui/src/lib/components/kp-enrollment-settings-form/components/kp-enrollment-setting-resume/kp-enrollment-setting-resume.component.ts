import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EnrollmentConfig, EnrollmentType } from '../../model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';

const resumeMap = new Map<EnrollmentType, string>([
  [EnrollmentType.FREE, marker('UI.KP_ENROLLMENT_SETTINGS_FORM.RESUME.OPEN')],
  [EnrollmentType.COMPLIANCE, marker('UI.KP_ENROLLMENT_SETTINGS_FORM.RESUME.NORMATIVE')],
  [EnrollmentType.REQUIRED, marker('UI.KP_ENROLLMENT_SETTINGS_FORM.RESUME.REQUIRED')],
]);

@Component({
  selector: 'kp-enrollment-setting-resume',
  template: `<span [innerHTML]="resume | transloco: { date: date | date: 'shortDate', cycle }"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslocoPipe],
})
export class KpEnrollmentSettingResumeComponent implements OnChanges {
  @Input() enrollmentConfig: EnrollmentConfig;

  date: string;
  cycle: string;
  resume: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enrollmentConfig']) {
      this.fillText(this.enrollmentConfig);
    }
  }

  private fillText(enrollmentConfig: EnrollmentConfig): void {
    this.date = enrollmentConfig?.date;
    this.cycle = enrollmentConfig?.cycle?.compliance?.name;
    this.resume = resumeMap.get(enrollmentConfig?.enrollmentType) || '';
  }
}
