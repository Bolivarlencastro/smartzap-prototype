import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'pm-summary-card',
  imports: [MatIcon],
  template: `
    <div class="flex justify-between">
      <span class="text-2xxs font-bold">{{ title() }}</span>
      <mat-icon class="s-10 opacity-50">{{ icon() }}</mat-icon>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-3xl font-bold leading-none">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col justify-between border border-default rounded-xl p-3.5;

        height: 6.5rem;
        background-color: var(--mat-sys-surface);
        transition: all 0.22s cubic-bezier(0.2, 0, 0.1, 1);
      }

      :host:hover {
        @apply shadow-lg;
        transform: translateY(-3px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmSummaryCardComponent {
  title = input<string>();
  icon = input<string>();
}
