import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lp-summary-card',
  imports: [MatIcon, MatTooltipModule, TranslocoPipe],
  template: `
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold">{{ title() }}</span>
      <mat-icon class="s-6" [matTooltip]="tooltip()">info</mat-icon>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-3xl font-bold leading-none">{{ value() || 'N/A' }}</span>
      @if (!value()) {
        <span class="text-xs italic opacity-70">{{
          'LEADER_PANEL.OVERVIEW.SUMMARY.NO_VALUE_MESSAGE' | transloco
        }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col justify-between border border-default rounded-xl h-28 p-3.5;

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
export class SummaryCardComponent {
  title = input<string>();
  tooltip = input<string>();
  value = input<string | number>();
}
