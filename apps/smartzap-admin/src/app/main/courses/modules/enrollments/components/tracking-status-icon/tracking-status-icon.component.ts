import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

type DeliverStatus = 'DELIVERED' | 'WAITING' | 'ERROR';

@Component({
  selector: 'app-tracking-status-icon',
  templateUrl: './tracking-status-icon.component.html',
  imports: [MatTooltip, MatIcon, TranslocoPipe],
})
export class TrackingStatusIconComponent {
  @Input() status!: string;

  get deliverStatus(): DeliverStatus {
    if (['DELIVERED', 'SENT'].includes(this.status)) return 'DELIVERED';
    if (this.status === 'PENDING') return 'WAITING';
    return 'ERROR';
  }

  get deliverStatusColor(): string {
    const colorMap: Record<DeliverStatus, string> = {
      DELIVERED: '#4dc8ac',
      WAITING: '#f8b31b',
      ERROR: '#f47c52',
    };
    return colorMap[this.deliverStatus];
  }

  get tooltipMessage(): string {
    return `TRACKING.DELIVER_STATUS.${this.deliverStatus}`;
  }
}
