import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SummaryCardComponent } from '../../components/overview/summary-card/summary-card.component';
import { TeamSummaryCardItemComponent } from '../../components/overview/team-summary-card-item/team-summary-card-item.component';
import { TeamSummaryCardComponent } from '../../components/overview/team-summary-card/team-summary-card.component';
import { OverviewViewModel } from '../../models/overview';
import { OverviewActions, overviewFeature } from '../../store/overview';
import { Led } from '../../models/led';
import { LedOverviewActions } from '../../store/led-overview';

@Component({
  selector: 'lp-overview',
  imports: [
    SummaryCardComponent,
    DecimalPipe,
    PercentPipe,
    TranslocoPipe,
    NgxSkeletonLoaderModule,
    TeamSummaryCardComponent,
    TeamSummaryCardItemComponent,
  ],
  template: `
    @let summary = this.vm()?.summary;
    @let summaryLoading = this.vm()?.summaryLoading;
    @let teamSummary = this.vm()?.teamSummary;
    @let teamSummaryLoading = this.vm()?.teamSummaryLoading;
    @let hasGamification = this.vm()?.hasGamification;
    @let hasNormative = this.vm()?.hasNormative;

    <div class="p-5 grid grid-cols-[repeat(auto-fit,_minmax(288px,_1fr))] gap-4">
      @if (summaryLoading) {
        @for (i of [0, 1, 2, 3, 4]; track i) {
          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{ height: '7rem', 'border-radius': '1rem', 'margin-bottom': '0' }"
          ></ngx-skeleton-loader>
        }
      } @else {
        <lp-summary-card
          [title]="'LEADER_PANEL.OVERVIEW.SUMMARY.TOTAL_ENROLLMENTS.TITLE' | transloco"
          [value]="summary?.totalEnrollments"
          [tooltip]="'LEADER_PANEL.OVERVIEW.SUMMARY.TOTAL_ENROLLMENTS.TOOLTIP' | transloco"
        ></lp-summary-card>

        <lp-summary-card
          [title]="'LEADER_PANEL.OVERVIEW.SUMMARY.ACTIVE_LED_RATE.TITLE' | transloco"
          [value]="summary?.activeLedRate | percent: '1.0-0'"
          [tooltip]="'LEADER_PANEL.OVERVIEW.SUMMARY.ACTIVE_LED_RATE.TOOLTIP' | transloco"
        ></lp-summary-card>

        <lp-summary-card
          [title]="'LEADER_PANEL.OVERVIEW.SUMMARY.COMPLETION_RATE.TITLE' | transloco"
          [value]="summary?.completionRate | percent: '1.0-0'"
          [tooltip]="'LEADER_PANEL.OVERVIEW.SUMMARY.COMPLETION_RATE.TOOLTIP' | transloco"
        ></lp-summary-card>

        <lp-summary-card
          [title]="'LEADER_PANEL.OVERVIEW.SUMMARY.AVERAGE_HOURS_PER_LED.TITLE' | transloco"
          [value]="summary?.averageHoursPerLed | number: '1.1-1'"
          [tooltip]="'LEADER_PANEL.OVERVIEW.SUMMARY.AVERAGE_HOURS_PER_LED.TOOLTIP' | transloco"
        ></lp-summary-card>

        <lp-summary-card
          [title]="'LEADER_PANEL.OVERVIEW.SUMMARY.REQUIRED_COURSES_PROGRESS.TITLE' | transloco"
          [value]="summary?.requiredCoursesProgress | percent: '1.0-0'"
          [tooltip]="'LEADER_PANEL.OVERVIEW.SUMMARY.REQUIRED_COURSES_PROGRESS.TOOLTIP' | transloco"
        ></lp-summary-card>
      }
    </div>

    <div class="px-5 pb-5 flex flex-wrap gap-4">
      @if (teamSummaryLoading) {
        @for (i of [0, 1, 2, 3, 4]; track i) {
          <ngx-skeleton-loader
            class="team-summary-width"
            count="1"
            animation="pulse"
            [theme]="{ height: '490px', 'border-radius': '1rem', 'margin-bottom': '0' }"
          ></ngx-skeleton-loader>
        }
      } @else {
        <lp-team-summary-card
          class="team-summary-width"
          [title]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.REQUIRED_ENROLLMENTS.TITLE' | transloco"
          [hasItems]="!!teamSummary?.requiredEnrollments?.length"
          [emptyMessage]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.REQUIRED_ENROLLMENTS.EMPTY_MESSAGE' | transloco"
        >
          @for (item of teamSummary?.requiredEnrollments; track item.name; let last = $last) {
            <lp-team-summary-card-item
              [item]="item"
              [lastItem]="last"
              (click)="openDialog(item)"
              class="cursor-pointer"
            >
              {{ item.data }}
            </lp-team-summary-card-item>
          }
        </lp-team-summary-card>

        <lp-team-summary-card
          class="team-summary-width"
          [title]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.OPTIONAL_ENROLLMENTS.TITLE' | transloco"
          [hasItems]="!!teamSummary?.optionalEnrollments?.length"
          [emptyMessage]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.OPTIONAL_ENROLLMENTS.EMPTY_MESSAGE' | transloco"
        >
          @for (item of teamSummary?.optionalEnrollments; track item.name; let last = $last) {
            <lp-team-summary-card-item
              [item]="item"
              [lastItem]="last"
              (click)="openDialog(item)"
              class="cursor-pointer"
            >
              {{ item.data }}
            </lp-team-summary-card-item>
          }
        </lp-team-summary-card>

        <lp-team-summary-card
          class="team-summary-width"
          [title]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.INACTIVE_LED.TITLE' | transloco"
          [hasItems]="!!teamSummary?.inactiveLed?.length"
          [emptyMessage]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.INACTIVE_LED.EMPTY_MESSAGE' | transloco"
        >
          @for (item of teamSummary?.inactiveLed; track item.name; let last = $last) {
            <lp-team-summary-card-item
              [item]="item"
              [lastItem]="last"
              (click)="openDialog(item)"
              class="cursor-pointer"
            >
              {{ item.data }}
            </lp-team-summary-card-item>
          }
        </lp-team-summary-card>

        @if (hasNormative) {
          <lp-team-summary-card
            class="team-summary-width"
            [title]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.EXPIRING_REGULATIONS.TITLE' | transloco"
            [hasItems]="!!teamSummary?.expiringRegulations?.length"
            [emptyMessage]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.EXPIRING_REGULATIONS.EMPTY_MESSAGE' | transloco"
          >
            @for (item of teamSummary?.expiringRegulations; track item.name; let last = $last) {
              <lp-team-summary-card-item
                [item]="item"
                [lastItem]="last"
                (click)="openDialog(item)"
                class="cursor-pointer"
              >
                {{ item.data }}
              </lp-team-summary-card-item>
            }
          </lp-team-summary-card>
        }

        @if (hasGamification) {
          <lp-team-summary-card
            class="team-summary-width"
            [title]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.TEAM_RANKING.TITLE' | transloco"
            [hasItems]="!!teamSummary?.teamRanking?.length"
            [emptyMessage]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.TEAM_RANKING.EMPTY_MESSAGE' | transloco"
            [tooltip]="'LEADER_PANEL.OVERVIEW.TEAM_SUMMARY.TEAM_RANKING.TOOLTIP'"
          >
            @for (item of teamSummary?.teamRanking; track item.name; let index = $index; let last = $last) {
              <lp-team-summary-card-item [item]="item" [index]="index + 1" [lastItem]="last">
                {{ item.data }}
              </lp-team-summary-card-item>
            }
          </lp-team-summary-card>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        background-color: var(--mat-sys-surface-container);
      }

      .team-summary-width {
        flex: 1 1 0;
        min-width: 500px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  protected readonly vm: Signal<OverviewViewModel>;

  constructor(private readonly store: Store) {
    store.dispatch(OverviewActions.init());
    this.vm = toSignal(store.select(overviewFeature.selectViewModel));
  }

  openDialog(led: Led) {
    this.store.dispatch(LedOverviewActions.openDialog({ selectedUser: led }));
  }
}
