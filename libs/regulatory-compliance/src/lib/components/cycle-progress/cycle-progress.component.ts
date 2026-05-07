import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { KpDaysUntil } from '@keeps-platform-frontend-workspace/ui/kp-days-until';
import { CycleEnrollmentProgressPipe } from '../../pipes/cycle-enrollment-progress.pipe';
import { CycleIconPipe } from '../../pipes/cycle-icon.pipe';

marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.DAYS_UNTIL_EXPIRATION.PLURAL');
marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.DAYS_UNTIL_EXPIRATION.SINGULAR');

@Component({
  selector: 'kp-cycle-progress',
  templateUrl: './cycle-progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTooltip,
    MatProgressSpinner,
    MatIcon,
    MatBadge,
    KpPluralizeTranslatePipe,
    KpDaysUntil,
    CycleEnrollmentProgressPipe,
    CycleIconPipe,
  ],
  styles: `
    :host {
      .enrollment-badge {
        --background-color: var(--mat-sys-primary);
      }
    }
  `,
})
export class CycleProgressComponent {
  @Input({ required: true }) cycle: EnrollmentCycleDto;

  get enrollmentsCount(): number {
    return this.cycle?.cyclesCount || 0;
  }

  get deadline() {
    return this.cycle?.deadline || '';
  }
}
