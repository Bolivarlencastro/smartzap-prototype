import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tracking } from 'app/main/courses/model/tracking';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TrackingStatusIconComponent } from '../tracking-status-icon/tracking-status-icon.component';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpNormalizePercentPipe } from '@keeps-platform-frontend-workspace/ui/kp-normalize-percent';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { TrackingPercentagePipe } from '../tracking-list/pipes/tracking-percentage.pipe';

@Component({
  selector: 'app-tracking-list-item',
  templateUrl: './tracking-list-item.component.html',
  styles: [
    `
      .tracking-row {
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
    `,
  ],
  imports: [
    MatIcon,
    MatTooltip,
    TrackingStatusIconComponent,
    MatIconButton,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
    KpNormalizePercentPipe,
    KpContentIconName,
    TrackingPercentagePipe,
  ],
})
export class TrackingListItemComponent {
  @Input() tracking!: Tracking;
  @Input() showResendLink!: boolean;
  @Output() resendLink: EventEmitter<void> = new EventEmitter();

  handleResendLink(): void {
    this.resendLink.emit();
  }
}
