import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { LedEventItem } from '../../../models/led-event-item';
import { EventDateRangePipe } from '../../../pipes/event-date-range.pipe';
import { NgStyle } from '@angular/common';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

interface PresenceStatus {
  icon: string;
  color: string;
  labelKey: string;
}

@Component({
  selector: 'lp-led-event-item',
  imports: [MatIcon, TranslocoPipe, EventDateRangePipe, NgStyle],
  template: `
    @let item = this.item();
    @let presenceStatusIcon = this.presenceStatus().icon;
    @let presenceStatusColor = this.presenceStatus().color;
    @let presenceStatusLabel = this.presenceStatus().labelKey;

    <mat-icon class="s-6 text-primary">event</mat-icon>
    <div class="flex flex-col">
      <span class="text-sm [word-break:break-word] line-clamp-1">{{ item.name }}</span>
      <span class="text-2xxs [word-break:break-word] line-clamp-1 opacity-70">{{
        item | eventDateRange: ('LEADER_PANEL.GENERAL.TO' | transloco)
      }}</span>
    </div>

    <div class="flex flex-col items-center ml-auto opacity-70">
      <span class="text-xs font-bold">{{ eventStatus() | transloco }}</span>
      <span class="text-2xxs">{{ 'LEADER_PANEL.LED.EVENT.EVENT_STATUS.LABEL' | transloco }}</span>
    </div>

    <div class="w-32 flex items-center justify-end ml-1">
      <div class="flex gap-1 items-center h-8 px-2.5 rounded-full border border-default shadow-md">
        <mat-icon class="s-5" [ngStyle]="{ color: presenceStatusColor }">{{ presenceStatusIcon }}</mat-icon>
        <span class="text-2xxs">{{ presenceStatusLabel | transloco }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 3.5rem;
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
export class LedEventItemComponent {
  readonly item = input.required<LedEventItem>();
  readonly presenceStatus = computed(() => this.buildPresenceStatus());
  readonly eventStatus = computed(() => this.buildEventStatus());

  private buildPresenceStatus(): PresenceStatus {
    const { presence } = this.item();
    const hasPresenceStatus = typeof presence === 'boolean';

    if (!hasPresenceStatus) {
      return {
        icon: 'event_seat',
        color: '#2563eb',
        labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.ENROLLED',
      };
    }

    if (presence) {
      return {
        icon: 'check_circle',
        color: '#16a34a',
        labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.PRESENT',
      };
    }

    return {
      icon: 'cancel',
      color: '#dc2626',
      labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.ABSENT',
    };
  }

  private buildEventStatus(): string {
    const { development_status } = this.item();

    if (development_status === DevelopmentStatus.CLOSED) {
      return 'LEADER_PANEL.LED.EVENT.EVENT_STATUS.CLOSED';
    }

    return 'LEADER_PANEL.LED.EVENT.EVENT_STATUS.SCHEDULED';
  }
}
