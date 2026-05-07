import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  AnalyticsApiFilter,
  AnalyticsDetailsDialog,
  AnalyticsResponseRange,
  LabelValue,
  LazyResponse,
  StatsVariation,
  UserActivitiesStats,
  UserDataResponse,
  UserDataStats,
  UserSource,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { UserDetailsService } from '../../services/user-details.service';
import { getTranslocoScope } from '../../util';

import { KpUserDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-details-charts';

@Component({
  selector: 'kp-user-details-dialog',
  template: `
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between pt-2 pl-5 pr-2">
        <span class="text-xl">{{ 'ANALYTICS.USER_DETAILS_DIALOG.TITLE' | transloco }}</span>
        <button mat-icon-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <span class="text-sm mb-5 px-5">{{ 'ANALYTICS.USER_DETAILS_DIALOG.SUBTITLE' | transloco }}</span>
      <kp-user-details-charts
        class="px-5"
        [userData]="userData$ | async"
        [userResponse]="userResponse$ | async"
        [userStats]="userStats$ | async"
        [performanceRanges]="performanceRanges$ | async"
        [activitiesData]="activitiesData$ | async"
        [activitiesFilter]="activitiesFilter$ | async"
        [topEnrollmentCategories]="topEnrollmentCategories$ | async"
        [topContentConsumed]="topContentConsumed$ | async"
        [hideButtonHeader]="true"
        (activitiesFilterEvent)="onActivitiesFilterChanged($event)"
        (filter)="onFilterChart($event)"
      ></kp-user-details-charts>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [getTranslocoScope(), UserDetailsService],
  imports: [CommonModule, TranslocoModule, MatButtonModule, MatIconModule, KpUserDetailsChartsComponent],
})
export class UserDetailsDialogComponent implements OnInit {
  userId: string;
  readonly FILTER_LAST_7_DAYS = 'last_7';
  readonly FILTER_LAST_30_DAYS = 'last_30';

  userData$: Observable<UserSource | null>;
  userResponse$: Observable<LazyResponse<UserDataResponse>>;
  userStats$: Observable<UserDataStats | null>;
  performanceRanges$: Observable<AnalyticsResponseRange[]>;
  activitiesFilter$ = new BehaviorSubject<string>(this.FILTER_LAST_30_DAYS);
  activitiesData$!: Observable<UserActivitiesStats>;
  topEnrollmentCategories$: Observable<LabelValue[]>;
  topContentConsumed$: Observable<LabelValue[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: AnalyticsDetailsDialog,
    public _dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    private _service: UserDetailsService,
  ) {
    this.userId = data.id;
    this.userResponse$ = _service.userResponse$;
    this.userData$ = _service.userData$;
    this.userStats$ = _service.userStats$;
    this.performanceRanges$ = _service.performanceRanges$;
    this.topEnrollmentCategories$ = _service.topEnrollmentCategories$;
    this.topContentConsumed$ = _service.topContentConsumed$;
    this.buildActivitiesStats();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  onActivitiesFilterChanged($value: MatButtonToggleChange): void {
    this.activitiesFilter$.next($value.value);
  }

  loadUserData(filter?: AnalyticsApiFilter): void {
    const params = filter || {};
    this._service.fetchUserData(this.userId, params);
  }

  onFilterChart(filter: AnalyticsApiFilter) {
    this.loadUserData(filter);
  }

  private buildActivitiesStats(): void {
    this.activitiesData$ = combineLatest([
      this.activitiesFilter$,
      this._service.userStats$.pipe(map((stats) => stats?.activities)),
    ]).pipe(
      map(([filter, stats]) => {
        let m_current = 0;
        let m_previous = 0;
        let p_current = 0;
        let p_previous = 0;

        if (stats) {
          if (filter === this.FILTER_LAST_30_DAYS) {
            m_current = stats.courses_recent_activities.last_30_days.unique_courses.value;
            m_previous = stats.courses_recent_activities.previous_30_days.unique_courses.value;
            p_current = stats.pulses_recent_activities.last_30_days.unique_pulses.value;
            p_previous = stats.pulses_recent_activities.previous_30_days.unique_pulses.value;
          } else if (filter === this.FILTER_LAST_7_DAYS) {
            m_current = stats.courses_recent_activities.last_7_days.unique_courses.value;
            m_previous = stats.courses_recent_activities.previous_7_days.unique_courses.value;
            p_current = stats.pulses_recent_activities.last_7_days.unique_pulses.value;
            p_previous = stats.pulses_recent_activities.previous_7_days.unique_pulses.value;
          }
        }

        const activitiesStats: UserActivitiesStats = {
          missions: {
            total: m_current,
            previous: m_previous,
            variation: this.buildVariation(m_current, m_previous),
          },
          pulses: {
            total: p_current,
            previous: p_previous,
            variation: this.buildVariation(p_current, p_previous),
          },
        };

        return activitiesStats;
      }),
    );
  }

  private buildVariation(current: number, previous: number): StatsVariation {
    let rate = 0;

    if (previous) {
      rate = (current - previous) / previous;
    } else if (current) {
      rate = 1;
    }

    if (rate > 0) {
      return {
        rate,
        dir: 'inc',
        class: 'text-green-500',
        icon: 'trending_up',
      };
    }

    if (rate < 0) {
      return {
        rate,
        dir: 'dec',
        class: 'text-red-500',
        icon: 'trending_down',
      };
    }

    // rate == 0
    return {
      rate,
      dir: 'eq',
      class: 'text-gray-500',
      icon: 'trending_flat',
    };
  }
}
