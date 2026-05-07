import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { LedOverviewTabModel } from '../../../models/led-overview-tab';

type AlertStatusType = 'overdue' | 'due-soon' | 'up-to-date';

interface AlertStatusModel {
  icon: string;
  color: string;
  title: string;
  trainingCountLabel: string;
  trainingCountColor: string;
}

@Component({
  selector: 'lp-led-overview-alert-status',
  imports: [MatIcon, TranslocoPipe, KpPluralizeTranslatePipe, NgStyle],
  template: `
    @let data = this.data();
    @let status = this.alertStatusType();
    @let statusData = this.alertStatusData();

    <mat-icon class="s-7 mt-0.5" [ngStyle]="{ color: statusData.color }">{{ statusData.icon }}</mat-icon>
    <div class="flex flex-col justify-center" [ngStyle]="{ color: statusData.color }">
      <span class="font-bold">{{ statusData.title | transloco }}</span>

      <span class="text-xs font-bold" [ngStyle]="{ color: statusData.trainingCountColor }">
        @if (status === 'overdue') {
          {{ data.overdue_training }}
        } @else if (status === 'due-soon') {
          {{ data.due_soon_training }}
        }

        {{ statusData.trainingCountLabel | transloco }}
      </span>

      <span class="text-2xxs">
        {{
          'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.LAST_ACTIVITY' | kpPluralizeTranslate: { value: data.last_activity }
        }}
      </span>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      height: 5.25rem;
      padding: 0.875rem;
      gap: 0.75rem;
      border-radius: 0.5rem;

      &.overdue {
        background-color: rgb(254, 242, 242);
        border-left: 4px solid rgb(239, 68, 68);
      }

      &.due-soon {
        background-color: rgb(254, 252, 232);
        border-left: 4px solid rgb(234, 179, 8);
      }

      &.up-to-date {
        background-color: rgb(240, 253, 244);
        border-left: 4px solid rgb(34, 197, 94);
      }
    }
  `,
  host: {
    '[class]': 'alertStatusType()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedOverviewAlertStatusComponent {
  readonly data = input.required<LedOverviewTabModel>();

  readonly alertStatusType = computed(() => this.getAlertStatusType());
  readonly alertStatusData = computed(() => this.getAlertStatusData());

  private getAlertStatusType(): AlertStatusType {
    const { overdue_training, due_soon_training } = this.data();

    if (overdue_training) {
      return 'overdue';
    }

    if (due_soon_training) {
      return 'due-soon';
    }

    return 'up-to-date';
  }

  private getAlertStatusData(): AlertStatusModel {
    const status = this.alertStatusType();

    if (status === 'overdue') {
      return {
        icon: 'error',
        color: 'rgb(220, 38, 38)',
        title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.OVERDUE',
        trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.OVERDUE',
        trainingCountColor: 'rgb(153, 27, 27)',
      };
    }

    if (status === 'due-soon') {
      return {
        icon: 'warning',
        color: 'rgb(202, 138, 4)',
        title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.DUE_SOON',
        trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.DUE_SOON',
        trainingCountColor: 'rgb(133, 77, 14)',
      };
    }

    return {
      icon: 'check_circle',
      color: 'rgb(22, 163, 74)',
      title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.UP_TO_DATE',
      trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.UP_TO_DATE',
      trainingCountColor: 'rgb(22, 101, 52)',
    };
  }
}
