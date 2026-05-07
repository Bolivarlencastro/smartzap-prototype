import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-cycle-actions',
  templateUrl: './cycle-actions.component.html',
  styles: [
    `
      :host {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip, MatIconButton, TranslocoPipe],
})
export class CycleActionsComponent {
  @Input() enrollment: EnrollmentCycleDto;
  @Input() hasError: boolean;

  @Output() renew = new EventEmitter<void>();
  @Output() inactivate = new EventEmitter<void>();

  get inactivateDisabled() {
    return (
      !this.enrollment?.cycle?.id || this.enrollment?.status === 'DISABLED' || this.enrollment?.status === 'EXPIRED'
    );
  }

  get canRenew(): boolean {
    return !this.hasError;
  }

  get renewDisabled(): boolean {
    return (
      !this.enrollment?.cycle?.id || (this.enrollment?.status !== 'EXPIRED' && this.enrollment?.status !== 'DISABLED')
    );
  }

  onRenew() {
    this.renew.emit();
  }

  onInactivate() {
    this.inactivate.emit();
  }
}
