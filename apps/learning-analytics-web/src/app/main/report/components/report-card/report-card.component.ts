import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  imports: [MatTooltip, MatIcon, MatCard, TranslocoPipe],
  styles: `
    mat-card {
      &:hover,
      &:focus {
        background: var(--mat-sys-surface-container);
      }

      &.primary-color {
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-primary-fixed);

        &:hover,
        &:focus {
          background: var(--mat-sys-primary-fixed-dim);
        }
      }
    }
  `,
})
export class ReportCardComponent {
  @Input() colored: boolean;
  @Input() label!: string;
  @Input() svgIcon!: string;

  @Output() cardSelected = new EventEmitter();

  showDatails = false;
}
