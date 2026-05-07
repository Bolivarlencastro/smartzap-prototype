import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LedChannelItem } from '../../../models/led-channel-item';
import { PulsesCounterComponent } from '../../pulses-counter/pulses-counter.component';

@Component({
  selector: 'lp-led-channel-item',
  imports: [MatIcon, PulsesCounterComponent],
  template: `
    @let item = this.item();

    <mat-icon class="s-6 text-primary">hub</mat-icon>
    <span class="text-sm [word-break:break-word] line-clamp-1">{{ item?.name }}</span>
    <lp-pulses-counter class="ml-auto" [count]="item?.consumed_pulses" [total]="item?.total_pulses" />
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
export class LedChannelItemComponent {
  readonly item = input.required<LedChannelItem>();
}
