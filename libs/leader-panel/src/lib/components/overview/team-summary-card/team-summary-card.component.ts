import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'lp-team-summary-card',
  imports: [MatIcon, MatTooltip, TranslocoPipe],
  template: `
    <div class="flex items-center gap-1 p-3 h-14 border-b border-default">
      <span class="font-bold">{{ title() }}</span>

      @if (tooltip()) {
        <mat-icon class="s-6" [matTooltip]="tooltip() | transloco">info</mat-icon>
      }
    </div>
    @if (hasItems()) {
      <ng-content></ng-content>
    } @else {
      <div class="h-12 flex items-center justify-center text-sm opacity-70">{{ emptyMessage() }}</div>
    }
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl shadow-lg;
        background-color: var(--mat-sys-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSummaryCardComponent {
  title = input<string>();
  hasItems = input<boolean>();
  emptyMessage = input<string>();
  tooltip = input<string>();
}
