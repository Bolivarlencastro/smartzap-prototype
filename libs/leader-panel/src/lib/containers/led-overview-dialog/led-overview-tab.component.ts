import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedOverviewAlertStatusComponent } from '../../components/led-overview-dialog/led-overview-alert-status/led-overview-alert-status.component';
import { LedOverviewSummaryCardComponent } from '../../components/led-overview-dialog/led-overview-summary-card/led-overview-summary-card.component';
import { LedOverviewTabViewModel } from '../../models/led-overview-tab';
import { LedEnrollmentsHistoryChartComponent } from '../../components/led-overview-dialog/led-enrollments-history-chart/led-enrollments-history-chart.component';
import { LedOverviewTabActions, ledOverviewTabFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-overview-tab',
  imports: [
    KpSkeletonComponent,
    LedOverviewAlertStatusComponent,
    LedOverviewSummaryCardComponent,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    PercentPipe,
    DecimalPipe,
    LedEnrollmentsHistoryChartComponent,
  ],
  template: `
    @let loading = this.vm()?.loading;
    @let data = this.vm()?.data;

    @if (loading) {
      <kp-skeleton class="w-full h-20 bg-default rounded-md"></kp-skeleton>
      <div class="flex w-full gap-4">
        <kp-skeleton class="w-full h-16 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-16 bg-default rounded-md"></kp-skeleton>
        <kp-skeleton class="w-full h-16 bg-default rounded-md"></kp-skeleton>
      </div>
      <kp-skeleton class="w-full h-56 bg-default rounded-md"></kp-skeleton>
    } @else {
      <lp-led-overview-alert-status [data]="data"></lp-led-overview-alert-status>
      <div class="grid-auto-fit">
        <lp-led-overview-summary-card icon="rocket_launch">
          <span summaryValue>{{ data?.completed_enrollments }}/{{ data?.total_enrollments }}</span>
          <span summaryLabel>{{ 'LEADER_PANEL.LED.OVERVIEW.SUMMARY_CARD.COMPLETED_ENROLLMENTS' | transloco }}</span>
        </lp-led-overview-summary-card>

        <lp-led-overview-summary-card icon="task_alt">
          <span summaryValue>{{ data?.completion_rate | percent }}</span>
          <span summaryLabel>{{ 'LEADER_PANEL.LED.OVERVIEW.SUMMARY_CARD.COMPLETION_RATE' | transloco }}</span>
        </lp-led-overview-summary-card>

        <lp-led-overview-summary-card icon="military_tech">
          <span summaryValue
            >{{ data?.ranking_points | number: '1.0-0' }}
            {{
              'LEADER_PANEL.LED.OVERVIEW.SUMMARY_CARD.RANKING.POINTS'
                | kpPluralizeTranslate: { value: data?.ranking_points }
            }}</span
          >
          <span summaryLabel>{{
            'LEADER_PANEL.LED.OVERVIEW.SUMMARY_CARD.RANKING.POSITION' | transloco: { value: data?.ranking_position }
          }}</span>
        </lp-led-overview-summary-card>

        <lp-led-enrollments-history-chart class="col-span-full"></lp-led-enrollments-history-chart>
      </div>
    }
  `,
  styles: `
    :host {
      @apply p-5 flex flex-col gap-4;
    }

    .grid-auto-fit {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedOverviewTabComponent {
  readonly vm: Signal<LedOverviewTabViewModel>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedOverviewTabActions.fetchData());
    this.vm = toSignal(this.store.select(ledOverviewTabFeature.selectViewModel));
  }
}
