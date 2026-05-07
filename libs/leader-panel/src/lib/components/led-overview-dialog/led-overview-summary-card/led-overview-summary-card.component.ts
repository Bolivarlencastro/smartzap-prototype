import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lp-led-overview-summary-card',
  imports: [MatIcon],
  template: `
    <div class="icon-container">
      <mat-icon class="icon">{{ icon() }}</mat-icon>
    </div>

    <div class="flex flex-col justify-center">
      <span class="font-bold text-xl">
        <ng-content select="[summaryValue]"></ng-content>
      </span>
      <span class="text-xs opacity-70">
        <ng-content select="[summaryLabel]"></ng-content>
      </span>
    </div>
  `,
  styles: `
    :host {
      @apply border border-default w-full;

      display: flex;
      align-items: center;
      height: 4.7rem;
      padding: 0.875rem;
      gap: 0.75rem;
      border-radius: 0.5rem;
      background-color: var(--mat-sys-surface);
    }

    .icon-container {
      @apply flex items-center justify-center h-10 w-10 rounded-full;
      background-color: var(--mat-sys-primary-container);
    }

    .icon {
      @apply s-7;
      color: var(--mat-sys-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedOverviewSummaryCardComponent {
  readonly icon = input.required<string>();
}
