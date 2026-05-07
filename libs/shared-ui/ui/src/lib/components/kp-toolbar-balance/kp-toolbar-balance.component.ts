import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-toolbar-balance',
  templateUrl: './kp-toolbar-balance.component.html',
  styles: [
    `
      .toolbar-zaps-balance--compact {
        min-width: auto;
        gap: 0.5rem;
        border-left: 1px solid var(--mat-sys-outline-variant);
        border-right: 1px solid var(--mat-sys-outline-variant);
        border-radius: 0 !important;
        --mdc-text-button-container-shape: 0;
        --mat-text-button-state-layer-shape: 0;
        color: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        display: inline-flex;
        align-items: center;
        align-self: center;
        background: transparent !important;
      }

      .toolbar-zaps-balance--compact:hover,
      .toolbar-zaps-balance--compact:focus,
      .toolbar-zaps-balance--compact:active {
        background: transparent !important;
      }

      .toolbar-zaps-balance--compact .mat-mdc-button-persistent-ripple,
      .toolbar-zaps-balance--compact .mat-mdc-button-ripple,
      .toolbar-zaps-balance--compact .mat-mdc-button-touch-target,
      .toolbar-zaps-balance--compact .mdc-button__ripple {
        border-radius: 0 !important;
      }

      .toolbar-zaps-balance__icon {
        color: var(--mat-sys-on-surface);
        flex-shrink: 0;
      }

      .toolbar-zaps-balance__content {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        line-height: 1;
        white-space: nowrap;
        flex-wrap: nowrap;
        gap: 0.375rem;
      }

      .toolbar-zaps-balance__value {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1;
      }

      .toolbar-zaps-balance__label {
        font-size: 0.625rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--mat-sys-primary);
        line-height: 1;
        transform: translateY(-1px);
      }
    `,
  ],
  imports: [MatButton, MatIcon, TranslocoPipe],
})
export class KpToolbarBalanceComponent {
  @Input() balance: number;
  @Input() compact = false;
  @Output() openDetails: EventEmitter<void>;

  constructor() {
    this.openDetails = new EventEmitter();
  }
}
