import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { LedPulseItem } from '../../../models/led-pulse-item';

@Component({
  selector: 'lp-led-pulse-item',
  imports: [MatIcon, TranslocoPipe, DatePipe],
  template: `
    @let item = this.item();

    <mat-icon class="s-6 text-primary">track_changes</mat-icon>
    <span class="text-sm [word-break:break-word] line-clamp-1">{{ item.name }}</span>
    <span class="ml-auto text-xs opacity-70">
      {{ 'LEADER_PANEL.GENERAL.VIEWED_IN' | transloco }} {{ item.last_date | date: 'shortDate' }}
    </span>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 3.25rem;
      padding: 0.7rem;
      gap: 0.75rem;
      background-color: var(--mat-sys-surface-container-low);
      border-radius: 0.5rem;

      &:hover {
        background: var(--mat-sys-surface-container);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedPulseItemComponent {
  readonly item = input.required<LedPulseItem>();
}
