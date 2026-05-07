import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-mobile-toggle',
  imports: [CommonModule, TranslocoModule, MatButtonModule, MatIconModule],
  templateUrl: './kp-mobile-toggle.component.html',

  styles: [
    `
      .selected {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .item {
        border-color: var(--mat-sys-surface-container-highest);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpMobileToggleComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() selected: boolean;
  @Input() disabled: boolean;
  @Output() toggleChange = new EventEmitter<void>();

  onToggle(): void {
    this.toggleChange.emit();
  }
}
