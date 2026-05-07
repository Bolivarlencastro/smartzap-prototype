import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kp-speed-dial-option',
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  template: `
    <button
      mat-icon-button
      [matTooltip]="tooltip"
      matTooltipPosition="left"
      [class]="bgClass"
      class="kp-speed-dial-option"
      [disabled]="disabled"
    >
      <mat-icon [class]="iconClass">{{ icon }}</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSpeedDialOptionComponent {
  @Input() icon: string;
  @Input() tooltip: string;
  @Input() bgClass = 'bg-secondary-container';
  @Input() iconClass = 'text-on-secondary-container';
  @Input() disabled: boolean;
}
